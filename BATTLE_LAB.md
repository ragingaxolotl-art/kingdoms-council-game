# Battle Lab and shared rules

Two-player PIN test: https://ragingaxolotl-art.github.io/kingdoms-council-game/battle-lab/battle-online.html
Four-country solo test: https://ragingaxolotl-art.github.io/kingdoms-council-game/battle-lab/battle-lab.html

Both use the current student game's engine via `RegimentGame.forMode('battle-lab')`. Combat, troops, movement, equipment, captures and retreats share one source. Battle mode disables civilian feeding/research and sends land income directly to Military. It deliberately keeps its own setup and two-player lobby interface.

Movement: cavalry 4, archers 3, spears 2, artillery 1 territory per round. March/roads research adds the same +1/+2 to every type; Battle Lab can select those bonuses without research. Pair your ready cavalry and artillery in the same territory during planning. Either unit's order moves both at the average range rounded down (2 before bonuses). Detach during planning to restore independent movement; pairing/detaching clears both orders. Combat and health remain separate. A death or separate retreat ends the pair. Old saves are migrated; previously saved artillery orders beyond its new range are cleared for replanning.

## One build and backend release

Run `node scripts/build-classroom.cjs`. It regenerates both Battle Lab interfaces, ESM rules, room seed and the combined Supabase classroom bundle. Published lab pages reference the root shared scripts; artwork is refreshed automatically. Never hand-edit generated bundles or `dist/battle-lab`.

Deploy `supabase/functions/classroom` to project `bnmghtjwolplmdjwgpyl` once for both modes. `/classroom` retains classroom authentication; `/classroom/battle` retains Battle Lab token/PIN authorization and its existing private tables. `/classroom/rules` exposes only the rules hash. The legacy `battle-lab` endpoint forwards old clients to this canonical server. No SQL changes are needed for this update.

Pages CI builds both modes, tests both, and checks the deployed rules hash before publishing. A combat change cannot publish a mismatched browser version. No separate Battle Lab rules maintenance is needed. Mode-specific UI changes still belong to their respective interface.

Invitations expire after 24 hours, matches after seven days. Both players mark Ready to resolve each stage; both must agree to replay. Existing sessions and browser reconnect tokens remain usable.
