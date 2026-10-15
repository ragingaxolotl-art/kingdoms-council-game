const assert=require('node:assert/strict');
const {create}=require('../dist/classroom-outbox.js');
const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
const context={classId:'class-a',actor:'student-a',country:0,role:'economy'};
const pending={...context,command:{id:'one-action',revision:3,type:'allocate',args:{}}};
const error=status=>Object.assign(Error('Injected failure'),{status});
(async()=>{
 let box=create(storage),commits=0,attempts=0;const receipts=new Map();
 const send=async p=>{attempts++;if(!receipts.has(p.command.id)){commits++;receipts.set(p.command.id,{view:{revision:4}});}if(attempts<=2)throw error(attempts===1?undefined:503);return {...receipts.get(p.command.id),duplicate:true};};
 box.enqueue(pending);assert.deepEqual(box.read(),pending);assert.throws(()=>box.enqueue(pending));
 assert.equal((await box.flush(context,send)).kind,'pending');
 box=create(storage); // Browser reload after the server committed but the reply vanished.
 assert.equal((await box.flush(context,send)).kind,'pending');assert.deepEqual(box.read(),pending);
 const result=await box.flush(context,send);assert.equal(result.kind,'saved');assert(result.data.duplicate);assert.equal(commits,1);assert.equal(attempts,3);assert.equal(box.read(),null);
 for(const status of [408,429,500,502]){box.enqueue(pending);assert.equal((await box.flush(context,async()=>{throw error(status);})).kind,'pending');assert.deepEqual(box.read(),pending);box.clear();}
 box.enqueue(pending);assert.equal((await box.flush(context,async()=>{throw error(401);})).kind,'signin');assert(box.read());
 assert.equal((await box.flush({...context,classId:'other'},send)).kind,'other');assert.equal((await box.flush({...context,actor:'other'},send)).kind,'other');assert.equal(attempts,3);
 assert.equal((await box.flush({...context,role:'military'},send)).kind,'reassigned');assert.equal(box.read(),null);assert.equal(attempts,3);
 box.enqueue(pending);assert.equal((await box.flush(context,async()=>{throw error(409);})).kind,'rejected');assert.equal(box.read(),null);
 box.enqueue(pending);let release;const active=box.flush(context,()=>new Promise(resolve=>release=resolve));assert.equal((await box.flush(context,send)).kind,'busy');release({view:{}});await active;assert.equal(box.read(),null);
 const teacher={...pending,actor:'teacher'};box.enqueue(teacher);await box.flush({...context,actor:'teacher',country:2,role:'research'},async p=>{assert.equal(p.country,0);assert.equal(p.role,'economy');return {};});assert.equal(box.read(),null);
 const denied=create({...storage,setItem:()=>{throw Error('Storage denied');}});assert.throws(()=>denied.enqueue(pending));assert.equal(denied.read(),null);
 console.log('PASS durable save recovery across repeated lost replies/reload, one commit, retryable failures, stale rejection, reassignment, account scope and concurrent retry exclusion');
})().catch(e=>{console.error(e);process.exitCode=1;});
