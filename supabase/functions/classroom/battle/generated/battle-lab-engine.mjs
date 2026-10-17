import SharedRules from './regiments-engine.mjs';
// Mode adapter: all combat rules come from the student game's shared engine.
const BattleRules=SharedRules.forMode('battle-lab');


export default BattleRules;
