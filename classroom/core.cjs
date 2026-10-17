/* Authoritative classroom commands. No browser-supplied game replacements. */
const R = require('../dist/regiments-engine.js');
const D = R.development;
const roles = ['economy', 'military', 'research'];
const labels = { economy: 'Economy', military: 'Military', research: 'R&D' };
const goods = R.goods;
const clone = x => structuredClone(x);
const zero = () => Object.fromEntries(goods.map(g => [g, 0]));
function check(ok, message, status = 400) { if (!ok) { const e = Error(message); e.status = status; throw e; } }
function create(game, name) {
  check(typeof name === 'string' && name.trim().length > 0 && name.length <= 80, 'Give the class a short name.');
  const valid = R.validate(clone(game));
  return { schema: 1, name: name.trim(), revision: 0, game: valid, members: [], ready: {}, receipts: [], summaries: [], closed: false };
}
function assignment(session, actor) {
  if (actor.teacher) return { id: 'teacher', country: actor.country ?? 0, role: actor.role ?? 'economy' };
  const m = session.members.find(m => m.id === actor.id && !m.disabled);
  check(m, 'Your assignment is no longer active. Ask your teacher for a new PIN.', 401);
  return m;
}
const phaseKey = s => s.game.turn + ':' + s.game.phase;
function required(session, member) {
  const s = session.game, c = member.country;
  if (s.phase === 'orders' || s.phase === 'results') return true;
  if (s.phase === 'decisions') return member.role === 'military' && (s.conflicts.some(x => x.countries.includes(c)) || s.offers.some(x => x.to === c));
  if (s.phase === 'retreat') return member.role === 'economy' && s.territories.some(t => t.owner === c) || member.role === 'military' && (s.units.some(u => u.country === c && u.hp > 0 && u.retreat?.required) || R.sharedCaptures(s).some(p => p.claimants.includes(c)));
  return false;
}
function blockers(session) {
  const s = session.game, out = [];
  for (const m of session.members.filter(m => !m.disabled && required(session, m))) {
    if (session.ready[m.id] !== phaseKey(session)) out.push({ member: m.id, country: m.country, text: m.label + ' · ' + labels[m.role] + ' is not ready' });
  }
  if (s.phase === 'movement' && s.march.pending) out.push({text:'Resolve Attack or Pass at '+s.territories[s.march.pending.territory].name});
  if (s.phase === 'decisions') for (const c of s.countries) {
    if (s.conflicts.some(x => x.countries.includes(c.id)) && !s.ready.includes(c.id)) out.push({ country: c.id, text: c.name + ': confirm targets or hold' });
  }
  if (s.phase === 'retreat') {
    for (const c of s.countries) if (s.territories.some(t => t.owner === c.id) && !c.foodConfirmed) out.push({ country: c.id, text: c.name + ': confirm civilian food' });
    for (const u of s.units.filter(u => u.hp > 0 && u.retreat?.required)) if (R.retreatOptions(s, u).length && !R.retreatOptions(s, u).includes(u.retreatTo)) out.push({ country: u.country, text: s.countries[u.country].name + ': choose retreat for regiment ' + u.id });
    for (const p of R.sharedCaptures(s)) for (const c of p.claimants) if (!Object.hasOwn(s.captureAgreements[p.territory]?.votes || {}, c)) out.push({ country: c, text: s.countries[c].name + ': decide shared capture ownership' });
  }
  return out;
}
function yearSummary(before, after) {
  return after.countries.map(c => {
    const old = before.countries[c.id], log = after.history[0];
    const accounts = x => ({ treasury: clone(x.stock), military: clone(x.accounts.military), research: clone(x.accounts.research) });
    return {
      country: c.id, year: before.turn,
      beforeSettlement: accounts(old), availableNextYear: accounts(c),
      produced: clone(log.income.find(i => i.country === c.id) || zero()),
      civilianFood: before.territories.filter(t => t.owner === c.id).reduce((n, t) => n + (old.foodPlan[t.id] || 0), 0),
      militaryFood: clone(c.lastSupply), deliveries: clone(old.allocations),
      discoveries: c.knowledge.filter(k => !old.knowledge.includes(k)).map(k => ({ key: k, name: D.techs[k].name })),
      territoriesGained: after.territories.filter(t => t.owner === c.id && before.territories[t.id].owner !== c.id).map(t => t.name),
      territoriesLost: before.territories.filter(t => t.owner === c.id && after.territories[t.id].owner !== c.id).map(t => t.name),
      battles: log.battles.filter(b => b.records.some(u => u.country === c.id)),
      events: log.events.filter(e => e.startsWith(c.name + ': ')),
      objectives: R.objectives ? R.objectives.rows(after, c.id, R.output) : [],
    };
  });
}
function execute(session, actor, request) {
  check(request && typeof request.id === 'string' && /^[a-zA-Z0-9-]{12,80}$/.test(request.id), 'Missing action identifier.');
  check(!session.closed || actor.teacher, 'This class is closed.', 403);
  const identity = assignment(session, actor);
  const receipt = actor.teacher ? 'teacher:' + request.id : identity.id + ':' + request.id;
  if (session.receipts.includes(receipt)) return { session, duplicate: true };
  check(request.revision === session.revision, 'The class changed. Your screen has updated; review and submit again.', 409);
  const next = clone(session), s = R.validate(next.game), a = request.args || {}, type = request.type;
  const member = assignment(next, actor), c = member.country, role = member.role;
  check(s.countries[c] && roles.includes(role), 'Choose a valid country and department.');
  const allow = wanted => check(actor.teacher || wanted.includes(role), 'This action belongs to another department.', 403);
  const ownUnit = id => check(s.units.some(u => u.id === id && u.country === c && u.hp > 0), 'That is not your regiment.', 403);
  const ownTerritory = id => check(s.territories[id]?.owner === c, 'That is not your territory.', 403);
  let affected = [c];
  if (type === 'member') {
    check(actor.teacher, 'Only your teacher assigns students.', 403);
    check(typeof a.id === 'string' && /^[a-zA-Z0-9-]{8,80}$/.test(a.id) && s.countries[a.country] && roles.includes(a.role) && typeof a.label === 'string' && a.label.trim().length > 0 && a.label.length <= 60, 'Check the student label, country and department.');
    check(next.members.length < 200 || next.members.some(m => m.id === a.id), 'A class can have up to 200 students.');
    const existing = next.members.find(m => m.id === a.id), entry = { id: a.id, label: a.label.trim(), country: a.country, role: a.role, disabled: !!a.disabled };
    if (existing) { affected.push(existing.country); Object.assign(existing, entry); } else next.members.push(entry);
    affected.push(a.country);
  } else if (type === 'close') { check(actor.teacher, 'Only your teacher closes the class.', 403); next.closed = !!a.closed;
  } else if (type === 'ready') {
    if (a.ready) {
      if (s.phase === 'decisions' && role === 'military') R.confirm(s, c);
      if (s.phase === 'retreat' && role === 'economy') check(s.countries[c].foodConfirmed || !s.territories.some(t => t.owner === c), 'Confirm your food plan first.');
      if (s.phase === 'retreat' && role === 'military') check(!blockers({ ...next, members: [] }).some(b => b.country === c && !b.text.includes('civilian food')), 'Finish your retreats and ownership decisions first.');
      next.ready[member.id] = phaseKey(next);
    } else delete next.ready[member.id];
    affected = [];
  } else if (type === 'advance') {
    check(actor.teacher, 'Only your teacher advances the class.', 403);
    const pending = blockers(next);
    // A deliberate teacher override bypasses readiness only, never missing game decisions.
    check(!pending.length || a.overrideReadiness === true && pending.every(b => b.member), pending.map(b => b.text).join('; '));
    next.game = s.phase === 'orders' ? R.startMovement(s) : R.advance(s);
    if (next.game.phase === 'decisions' && next.game.conflicts.length === 0 && next.game.offers.length === 0) next.game = R.advance(next.game);
    if (s.phase === 'retreat') { next.summaries.unshift({ year: s.turn, countries: yearSummary(s, next.game) }); next.summaries = next.summaries.slice(0, 20); }
    next.ready = {};
  } else if (type === 'encounter') { allow(['military']); R.encounter(s,c,a.decision,a.territory);
  } else if (type === 'allocate') { allow(['economy']); R.allocate(s, c, a.plan);
  } else if (type === 'feed') { allow(['economy']); R.feed(s, c, a.plan); R.confirmFood(s, c);
  } else if (type === 'build') { allow(['economy']); ownTerritory(a.territory); R.build(s, c, a.territory, a.kind);
  } else if (type === 'repair') { allow(['economy']); ownTerritory(a.territory); R.repair(s, c, a.territory);
  } else if (type === 'order') { allow(['military']); ownUnit(a.unit); R.order(s, a.unit, a.territory, a.intent, a.path);
  } else if (type === 'attach') { allow(['military']); ownUnit(a.unit); ownUnit(a.other); R.attach(s,a.unit,a.other);
  } else if (type === 'detach') { allow(['military']); ownUnit(a.unit); R.detach(s,a.unit);
  } else if (type === 'clearOrder') { allow(['military']); check(s.phase === 'orders', 'Orders are locked.'); ownUnit(a.unit); R.clearOrder(s,a.unit);
  } else if (type === 'recruit') { allow(['military']); ownTerritory(a.territory); R.recruit(s, c, a.kind, a.territory);
  } else if (type === 'equip') { allow(['military']); ownUnit(a.unit); D.equip(s, c, a.unit);
  } else if (type === 'target') { allow(['military']); R.target(s, c, a.territory, a.target);
  } else if (type === 'retreat') { allow(['military']); ownUnit(a.unit); R.retreat(s, a.unit, a.territory); affected = s.countries.map(c => c.id);
  } else if (type === 'capture') { allow(['military']); R.chooseCaptureOwner(s, c, a.territory, a.recipient);
  } else if (type === 'allianceOffer' || type === 'allianceAccept') {
    allow(['military']); check(['orders', 'decisions'].includes(s.phase), 'Alliances are closed for this year.');
    const phase = s.phase; s.phase = 'decisions';
    if (type === 'allianceOffer') R.offer(s, c, a.country); else R.accept(s, a.country, c);
    s.phase = phase; affected.push(a.country);
  } else if (type === 'research') { allow(['research']); D.selectResearch(s, c, a.tech);
  } else if (type === 'fund') { allow(['research']); D.fundResearch(s, c);
  } else if (type === 'install') { allow(['research']); ownTerritory(a.territory); D.install(s, c, a.territory, a.kind);
  } else if (type === 'cityAction') { allow(['research']); ownTerritory(a.territory); if (a.unit != null) ownUnit(a.unit); D.cityAction(s, c, a.territory, a.kind, a.unit ?? null);
  } else if (type === 'claimKnowledge') { allow(['research']); D.claimKnowledge(s, c, a.index, a.tech);
  } else if (type === 'exchangeOffer') { allow(a.kind === 'trade' ? ['economy'] : ['research']); D.offer(s, c, a.country, a.kind, a.data); affected.push(a.country);
  } else if (type === 'exchangeAccept' || type === 'exchangeCancel') {
    const offer = s.exchangeOffers.find(o => o.id === a.offer); check(offer && (offer.from === c || offer.to === c), 'This offer is not addressed to your country.', 403);
    allow(offer.kind === 'trade' ? ['economy'] : ['research']);
    if (type === 'exchangeAccept') D.accept(s, c, a.offer); else D.cancel(s, c, a.offer);
    affected.push(offer.from, offer.to);
  } else check(false, 'Unknown classroom action.');
  if (type !== 'ready') for (const m of next.members) if (affected.includes(m.country)) delete next.ready[m.id];
  R.validate(next.game);
  next.revision++;
  next.receipts.push(receipt); next.receipts = next.receipts.slice(-4000);
  return { session: next, duplicate: false };
}
function command(session, actor, request) {
  try { return execute(session, actor, request); }
  catch(e) { if (!e.status && !(e instanceof TypeError)) e.status = 400; throw e; }
}
function project(session, actor, includeMap = false) {
  const m = assignment(session, actor), s = R.validate(clone(session.game)), c = s.countries[m.country];
  check(c && roles.includes(m.role), 'Choose a country and department.');
  const phases = { movement: ['Movement simulation', 'Watch all regiments take one step together. Every country in an encounter must pass, or one may attack and stop those troops until combat.'], orders: ['Start the year & plan', 'Use the supplies you have. Save your decisions, then mark yourself ready.'], decisions: ['Respond', 'Review encounters and offers. Choose targets or hold, then confirm.'], retreat: ['Results & final actions', 'Review battle results. Finish retreats, ownership decisions and civilian food before the year ends.'], results: ['Year-end summary', 'These are your final results and supplies available for next year. Review, then mark yourself ready.'] };
  const tasks = {
    economy: { orders: ['Check Treasury and food needs.', 'Allocate department funding and consider trades.', 'Build or repair settlements if affordable.', 'Save your plan and mark ready.'], decisions: ['Discuss responses with your country.', 'Wait for Military and the teacher.'], retreat: ['Review your territory and battle changes.', 'Choose food for every owned territory.', 'Confirm your food plan and mark ready.'], results: ['Read production, meals and deliveries.', 'Check supplies available next year.', 'Mark ready when your review is complete.'] },
    military: { orders: ['Review available Military resources.', 'Recruit or equip where affordable.', 'Choose movement or capture for each regiment.', 'Review alliances and mark ready.'], decisions: ['Review each meeting on the map.', 'Accept alliances if appropriate.', 'Choose an opponent or hold at every encounter.', 'Mark ready to confirm your targets.'], retreat: ['Read battle results.', 'Choose safe retreats where required.', 'Agree who receives shared captures.', 'Mark ready after final decisions.'], results: ['Review surviving regiments and territory changes.', 'Check deliveries and military meals.', 'Mark ready for next year.'] },
    research: { orders: ['Check your delivered Research resources.', 'Choose research and arrange cooperation before funding.', 'Fund a research installment; manage city facilities.', 'Review knowledge offers and mark ready.'], decisions: ['Discuss responses with your country.', 'Wait for Military and the teacher.'], retreat: ['Review the battle results.', 'Wait while food and captures are finalized.'], results: ['Read discoveries and research progress.', 'Check facility results and deliveries.', 'Mark ready for next year.'] },
  };
  const territories = s.territories.map(t => ({ id: t.id, name: t.name, owner: t.owner, point: t.point, neighbors: t.neighbors, happiness: t.happiness, foodNeed: t.foodNeed, settlementLevel: t.settlementLevel, fortification: t.fortification, defenseHp: t.defenseHp, maxDefense: R.maxDefense(t), output: R.output(t), deposit: t.deposit, builtTurn: t.builtTurn, ...(m.role === 'research' && t.owner === c.id ? { facilities: t.facilities, actionTurn: t.actionTurn } : {}), ...(t.owner === c.id ? { construction: Object.fromEntries(['settlement','fortification'].map(k=>[k,{cost:R.constructionCost(t,k),requires:D.requirement(t,k)}])) } : {}) }));
  for(const role of roles)tasks[role].movement=role==='military'?['Answer Attack or Pass when your troops meet.', 'The teacher advances everyone one step after all encounters are settled.', 'Combat waits until all other movement finishes.']:['Watch movement and discuss encounters with your Military department.'];
  const units = R.visibleUnits(s,c.id).filter(u => u.hp > 0).map(u => ({ id: u.id, country: u.country, type: u.type, hp: u.hp, territory: u.territory, readyTurn: u.readyTurn, gear: u.gear, ...(u.country === c.id && m.role === 'military' ? { movement:R.movement(s,u),pairedWith:u.pairedWith,pairOptions:R.pairOptions(s,u), order: u.order, supportTurn:u.supportTurn, legalRoutes:s.phase === 'orders' && u.readyTurn <= s.turn && u.supportTurn !== s.turn && !s.units.some(v=>v.id===u.pairedWith&&(v.readyTurn>s.turn||v.supportTurn===s.turn)) ? Object.fromEntries(s.territories.map(t=>[t.id,R.route(s,u.territory,t.id,u.country,true)]).filter(([id,path])=>path && path.length<=R.movement(s,u))) : {}, retreat: u.retreat, retreatTo: u.retreatTo, retreatOptions: R.retreatOptions(s, u), equipCost: D.equipCost(c,u) } : {}) }));
  const own = clone(c); if (m.role !== 'research') delete own.capturedKnowledge;
  const result = { name: session.name, revision: session.revision, year: s.turn, phase: s.phase, phaseTitle: phases[s.phase][0], phaseHelp: phases[s.phase][1], teacher: !!actor.teacher, assignment: { id: m.id, country: c.id, role: m.role, label: m.label || 'Teacher view' }, country: own, countries: s.countries.map(x => ({ id: x.id, name: x.name, color: x.color, specialty: x.specialty })), territories, units, tasks: tasks[m.role][s.phase], required: required(session,m), ready: session.ready[m.id] === phaseKey(session), closed: session.closed, march: actor.teacher && s.march ? clone(s.march) : R.movementView(s,c.id), moves: s.moves.filter(x=>x.country===c.id), battles: s.battles.filter(b=>b.records.some(u=>u.country===c.id)), conflicts: s.conflicts.filter(x=>x.countries.includes(c.id)), choices: Object.fromEntries(Object.entries(s.choices).filter(([key])=>Number(key.split(':')[1])===c.id)), alliances:s.alliances, allianceOffers:s.offers.filter(o=>o.to===c.id||o.from===c.id), exchanges:s.exchangeOffers.filter(o=>(o.to===c.id||o.from===c.id)&&(m.role==='economy'?o.kind==='trade':m.role==='research'?o.kind!=='trade':false)), partnerships:s.partnerships.filter(p=>p.a===c.id||p.b===c.id), disruptions:(s.diplomaticDisruptions||[]).filter(x=>(x.a===c.id||x.b===c.id)&&x.lastAttack>=s.turn-1).map(x=>({country:x.a===c.id?x.b:x.a,resumeYear:x.lastAttack+2})), captures:R.sharedCaptures(s).filter(p=>p.claimants.includes(c.id)).map(p=>({territory:p.territory,claimants:p.claimants,votes:s.captureAgreements[p.territory]?.votes||{}})), summary:session.summaries.find(y=>y.year===(s.phase==='results'?s.turn:s.turn-1))?.countries.find(x=>x.country===c.id)||null, objectives:R.objectives?R.objectives.rows(s,c.id,R.output):[], recruitSites:R.recruitmentSites(s,c.id).map(x=>x.territory), recruitCosts:Object.fromEntries(Object.keys(R.types).map(k=>[k,{cost:D.recruitCost(c,k),unlocked:D.unlocked(c,k)}])), researchCost:D.researchCost(c) };
  if (includeMap) result.cells = s.cells.map(x=>({polygon:x.polygon,territory:x.territory,land:x.land}));
  if (actor.teacher) { result.roster = session.members.map(x=>({...x,ready:session.ready[x.id]===phaseKey(session),required:required(session,x)})); result.blockers=blockers(session); }
  return clone(result);
}
module.exports = { R, D, roles, labels, goods, check, create, assignment, required, blockers, command, project, yearSummary };
