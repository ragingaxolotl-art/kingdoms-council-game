/* Display-only spending receipts, saved with the local campaign and checkpoints. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.DepartmentBudget=factory();})(globalThis,()=>{
'use strict';
const goods=['money','food','wood','metal'],departments=['military','research'];
const zero=()=>Object.fromEntries(goods.map(g=>[g,0]));
function valid(s){const b=s.departmentSpending;return b?.version===1&&b.turn===s.turn&&typeof b.complete==='boolean'&&Array.isArray(b.countries)&&b.countries.length===s.countries.length&&b.countries.every(c=>departments.every(d=>c?.[d]&&goods.every(g=>Number.isFinite(c[d][g])&&c[d][g]>=0&&c[d][g]<1e15)));}
function init(s,complete=false){if(!valid(s))s.departmentSpending={version:1,turn:s.turn,complete,countries:s.countries.map(()=>({military:zero(),research:zero()}))};return s;}
function record(before,next){
 init(next);
 if(before.turn!==next.turn){delete next.departmentSpending;return init(next,true);}
 // Copy receipts from the accepted state; rejected commands never reach here.
 const prior=init(structuredClone({turn:before.turn,countries:before.countries,departmentSpending:before.departmentSpending}));
 next.departmentSpending=structuredClone(prior.departmentSpending);
 for(const [i,c] of next.countries.entries())for(const d of departments)for(const g of goods){
  // Round-end deliveries/refunds can hide meal costs in the net balance change.
  const used=before.phase==='retreat'&&next.phase==='results'?(d==='military'&&g==='food'&&c.lastSupply?.turn===next.turn?c.lastSupply.paid:0):Math.max(0,before.countries[i].accounts[d][g]-c.accounts[d][g]);
  next.departmentSpending.countries[i][d][g]+=used;
 }
 return next;
}
function cards(s,country,department,ui){if(!departments.includes(department))return '';init(s);const b=s.departmentSpending,spent=b.countries[country][department],stock=s.countries[country].accounts[department],label=b.complete?'Spent this round':'Spent since opening';return `<div class="budget-cards">${goods.map(g=>`<article class="budget-card"><div class="budget-material">${ui.icon(g)}<h3>${ui.names[g]}</h3></div><div class="budget-available"><strong data-budget="${g}-available">${stock[g]}</strong><span>Available</span></div><p>${label}: <strong data-budget="${g}-spent">${spent[g]}</strong></p></article>`).join('')}</div>${b.complete?'':'<p class="budget-note">Earlier spending in this saved round was not recorded. Full-round totals begin next round.</p>'}`;}
return {init,record,cards};
});
