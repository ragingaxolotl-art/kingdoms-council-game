/* One durable, idempotent game command at a time, including across reloads. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ClassroomOutbox=factory();})(globalThis,()=>{
'use strict';
const key='cc-pending-action';
function create(storage){
 let sending=false;
 const read=()=>JSON.parse(storage.getItem(key)||'null');
 const clear=()=>storage.removeItem(key);
 return {
  read,clear,
  enqueue(pending){if(read())throw Error('Wait for your earlier save to be confirmed.');storage.setItem(key,JSON.stringify(pending));},
  async flush(context,send){
   if(sending)return {kind:'busy'};
   const pending=read();if(!pending)return {kind:'empty'};
   if(pending.classId!==context.classId||pending.actor!==context.actor)return {kind:'other'};
   if(pending.actor!=='teacher'&&(pending.country!==context.country||pending.role!==context.role)){
    clear();return {kind:'reassigned'};
   }
   sending=true;
   try{const data=await send(pending);clear();return {kind:'saved',data};}
   catch(error){
    // A timeout or server failure can occur after commit: keep the exact ID.
    if(!error.status||error.status>=500||error.status===408||error.status===429)return {kind:'pending',error};
    if(error.status===401)return {kind:'signin',error};
    clear();return {kind:'rejected',error};
   }finally{sending=false;}
  }
 };
}
return {create};
});
