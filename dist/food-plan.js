/* Whole-food planning only; the engine consumes food at round-end. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.FoodPlan=factory();})(globalThis,()=>{
function distribute(territories,available){const need=territories.reduce((n,t)=>n+t.foodNeed,0),budget=Math.min(need,Math.max(0,Math.floor(available))),plan={};if(!need)return Object.fromEntries(territories.map(t=>[t.id,0]));let used=0;const shares=territories.map(t=>{const exact=t.foodNeed*budget/need,n=Math.floor(exact);plan[t.id]=n;used+=n;return {id:t.id,remainder:exact-n};}).sort((a,b)=>b.remainder-a.remainder||a.id-b.id);for(let i=0;i<budget-used;i++)plan[shares[i].id]++;return plan;}
function complete(territories,available,existing){const plan=Object.fromEntries(territories.filter(t=>Object.hasOwn(existing,t.id)).map(t=>[t.id,existing[t.id]])),remaining=available-Object.values(plan).reduce((n,v)=>n+v,0);return {...plan,...distribute(territories.filter(t=>!Object.hasOwn(plan,t.id)),remaining)};}
function limit(territories,available,plan,id,value){const t=territories.find(t=>t.id===id);if(!t)throw Error('Choose one of your territories.');const others=Object.entries(plan).reduce((n,[key,v])=>n+(Number(key)===id?0:v),0),max=Math.max(0,Math.min(t.foodNeed,available-others)),n=Number(value);return {...plan,[id]:Number.isNaN(n)?0:Math.max(0,Math.min(max,Math.floor(n)))};}
const happiness=(t,food)=>Math.max(0,Math.min(100,t.happiness+(food===t.foodNeed?10:-Math.round(30*(1-food/t.foodNeed)))));
return {distribute,complete,limit,happiness};
});
