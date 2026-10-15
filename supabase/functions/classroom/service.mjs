// The same HTTP handler runs locally and in the deployed Edge Function.
import C from './generated/core.mjs';
const enc = new TextEncoder();
const hex = bytes => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
const token = () => hex(crypto.getRandomValues(new Uint8Array(32)));
const hash = async value => hex(await crypto.subtle.digest('SHA-256', enc.encode(value)));
export function handler({ store, verifyTeacher, origin, pepper, now = () => Date.now() }) {
  if (!pepper || pepper.length < 32) throw Error('Set a private CLASSROOM_PIN_PEPPER of at least 32 characters.');
  let keyPromise = crypto.subtle.importKey('raw', enc.encode(pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const pinHash = async (id, pin) => hex(await crypto.subtle.sign('HMAC', await keyPromise, enc.encode(id + ':' + pin)));
  return async req => {
    const headers = { 'Content-Type':'application/json', 'Cache-Control':'no-store', 'Access-Control-Allow-Origin':origin, 'Vary':'Origin', 'Access-Control-Allow-Headers':'authorization, content-type, apikey, x-student-token', 'Access-Control-Allow-Methods':'POST, OPTIONS' };
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
    try {
      if (req.headers.get('origin') && req.headers.get('origin') !== origin) return reply({ error:'This origin is not allowed.' }, 403);
      if (req.method === 'OPTIONS') return new Response(null, { status:204, headers });
      C.check(req.method === 'POST', 'Use POST.', 405);
      C.check(Number(req.headers.get('content-length') || 0) <= 35e6, 'Request is too large.', 413);
      const reader=req.body?.getReader(); let length=0; const chunks=[]; if(reader)for(;;){const part=await reader.read();if(part.done)break;length+=part.value.byteLength;if(length>35e6){await reader.cancel();C.check(false,'Request is too large.',413);}chunks.push(part.value);}const bytes=new Uint8Array(length);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}const raw=new TextDecoder().decode(bytes);
      let body; try { body = JSON.parse(raw); } catch { C.check(false, 'Invalid JSON.'); }
      const { op, classId } = body;
      let owner;
      const teacher = async () => { owner ??= await verifyTeacher(req.headers.get('authorization') || ''); C.check(owner, 'Sign in as the teacher.', 401); return owner; };
      if (op === 'list') return reply({ classes: await store.list(await teacher()) });
      if (op === 'create') {
        await teacher(); const id = crypto.randomUUID();
        const row = { id, owner, version:0, session:C.create(body.game, body.name), pins:{}, tokens:{} };
        await store.insert(row); return reply({ classId:id, view:C.project(row.session, { teacher:true }, true) });
      }
      C.check(typeof classId === 'string' && /^[a-f0-9-]{36}$/.test(classId), 'Open the class link supplied by your teacher.');
      // Most polls authenticate against compact metadata, avoiding map/game downloads.
      if (op === 'state' && Number.isInteger(body.revision) && !body.includeMap) {
        const head = await store.head(classId); C.check(head, 'Class not found.', 404);
        if (head.revision === body.revision) {
          const credential=req.headers.get('x-student-token');
          if (credential) {
            const access=head.tokens[await hash(credential)];
            C.check(access && access.expires > now() && head.members.some(m=>m.id===access.memberId&&!m.disabled), 'Your session ended. Enter your PIN again.', 401);
            C.check(!head.closed, 'This class is closed.', 403);
            await store.touch(classId,access.memberId,now());
            return reply({unchanged:true,revision:head.revision});
          }
          await teacher(); C.check(head.owner===owner, 'This class belongs to another teacher.', 403);
          const presence=await store.presence(classId);
          return reply({unchanged:true,revision:head.revision,connections:Object.fromEntries(head.members.map(m=>[m.id,now()-(presence[m.id]||0)<12000]))});
        }
      }
      let row = await store.load(classId); C.check(row, 'Class not found.', 404);
      row.session.game = C.R.validate(row.session.game);
      if (op === 'join') {
        C.check(!row.session.closed, 'This class is closed.', 403);
        C.check(typeof body.pin === 'string' && /^\d{6}$/.test(body.pin), 'Enter your six-digit PIN.');
        // The edge adapter supplies a trusted client IP; never trust a body field.
        const ip = await hash(store.clientIP(req));
        const ph = await pinHash(classId, body.pin);
        C.check(await store.rate('ip:' + ip, 120, now()) && await store.rate('class:' + classId, 300, now()) && await store.rate('pin:' + classId + ':' + ph, 8, now()), 'Too many sign-in attempts. Wait a minute and try again.', 429);
        const memberId = row.pins[ph];
        C.check(memberId && row.session.members.some(m => m.id === memberId && !m.disabled), 'PIN not recognized. Check with your teacher.', 401);
        const accessToken = token(), digest = await hash(accessToken);
        row.tokens = Object.fromEntries(Object.entries(row.tokens).filter(([,t]) => t.expires > now()));
        row.tokens[digest] = { memberId, expires:now() + 12 * 60 * 60 * 1000 };
        C.check(await store.cas(row.version, { ...row, version:row.version+1 }), 'Class changed while signing in. Please try again.', 409);
        await store.touch(classId, memberId, now());
        return reply({ token:accessToken, classId, view:C.project(row.session, { id:memberId }, true) });
      }
      let actor;
      const studentToken = req.headers.get('x-student-token');
      if (studentToken) {
        const access = row.tokens[await hash(studentToken)];
        C.check(access && access.expires > now(), 'Your session ended. Enter your PIN again.', 401);
        C.check(!row.session.closed, 'This class is closed.', 403);
        actor = { id:access.memberId }; C.assignment(row.session, actor);
        await store.touch(classId, actor.id, now());
      } else {
        await teacher(); C.check(row.owner === owner, 'This class belongs to another teacher.', 403);
        actor = { teacher:true, country:body.country ?? 0, role:body.role ?? 'economy' };
      }
      const view = async (includeMap = false) => {
        const out = C.project(row.session, actor, includeMap);
        if (actor.teacher) { const seen = await store.presence(classId); out.roster.forEach(m => { m.connected = now() - (seen[m.id] || 0) < 12000; }); }
        return out;
      };
      if (op === 'state') {
        // Teacher roster heartbeats must update even when no game action changed.
        if (!actor.teacher && body.revision === row.session.revision && !body.includeMap) return reply({ unchanged:true, revision:row.session.revision });
        return reply({ view:await view(!!body.includeMap) });
      }
      if (op === 'export') { C.check(actor.teacher, 'Only the teacher can download the full game.', 403); return reply({ game:row.session.game }); }
      if (op === 'logout') {
        if (studentToken) { delete row.tokens[await hash(studentToken)]; C.check(await store.cas(row.version, {...row,version:row.version+1}), 'Try signing out again.',409); }
        return reply({ ok:true });
      }
      let pin;
      if (op === 'assign') {
        C.check(actor.teacher, 'Only the teacher assigns PINs.', 403);
        const memberId = body.memberId || crypto.randomUUID();
        const request = { id:body.requestId, revision:body.revision, type:'member', args:{ id:memberId, label:body.label, country:body.assignedCountry, role:body.assignedRole, disabled:body.disabled } };
        const result = C.command(row.session, actor, request);
        if (result.duplicate) return reply({ view:await view(), pinAlreadyIssued:true });
        row.session = result.session;
        const revokedPins=Object.keys(row.pins).filter(key=>row.pins[key]===memberId);
        row.pins = Object.fromEntries(Object.entries(row.pins).filter(([,id]) => id !== memberId));
        row.tokens = Object.fromEntries(Object.entries(row.tokens).filter(([,t]) => t.memberId !== memberId));
        if (!body.disabled) {
          let ph;
          do { const n = new Uint32Array(1); do { crypto.getRandomValues(n); } while (n[0] >= 4294000000); pin=String(n[0]%1000000).padStart(6,'0'); ph=await pinHash(classId,pin); } while (row.pins[ph]||revokedPins.includes(ph));
          row.pins[ph]=memberId;
        }
      } else {
        C.check(op === 'command', 'Unknown request.');
        C.check(body.command?.type !== 'member', 'Use the assignment endpoint for membership changes.');
        const result = C.command(row.session, actor, body.command);
        row.session = result.session;
        if (result.duplicate) return reply({ view:await view(), duplicate:true });
      }
      C.check(await store.cas(row.version, { ...row, version:row.version+1 }), 'Another action arrived first. Refresh and review before submitting again.', 409);
      return reply({ view:await view(), ...(pin ? { pin } : {}) });
    } catch (e) { return reply({ error:e.status ? e.message : 'The request could not be completed. Your last saved game is unchanged.' }, e.status || 500); }
  };
}
