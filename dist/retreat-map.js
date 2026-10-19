/* Retreat choices always come from the engine; confirmation never moves a piece early. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.RetreatMap=factory();})(globalThis,()=>{
function unit(s,active,role,id){return role==='military'&&s.phase==='retreat'?s.units.find(u=>u.id===id&&u.country===active&&u.hp>0&&u.retreat?.required):null;}
function choices(R,s,active,role,id){const u=unit(s,active,role,id);return u?R.retreatOptions(s,u):[];}
function request({R,context,id,to,ask,commit,status}){
 const c=context(),u=unit(c.state,c.active,c.role,id);
 if(!u||!choices(R,c.state,c.active,c.role,id).includes(to)){status('Choose a highlighted safe neighbor for your retreating regiment.');return false;}
 const text=`Retreat ${R.types[u.type].name} #${id} (${u.hp} health) from ${c.state.territories[u.territory].name} to ${c.state.territories[to].name}? The troop moves when the teacher finishes retreats.`;
 ask(text,()=>{const next=context();if(next.state!==c.state||next.active!==c.active||!choices(R,next.state,next.active,next.role,id).includes(to)){status('The game changed. Select the retreating troop and choose its destination again.');return;}commit(id,to);});return true;
}
return {unit,choices,request};
});
