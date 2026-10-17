// Mode adapter: all combat rules come from the student game's shared engine.
const BattleRules=(typeof RegimentGame!=='undefined'?RegimentGame:require('./regiments-engine.js')).forMode('battle-lab');
if(typeof module!=='undefined')module.exports=BattleRules;
