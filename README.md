# Council & Crown — v0.11 Regiment game

A teacher-hosted territory game for sixth graders. The default game now uses large land chunks and whole regiment tokens. The separate heraldry classroom project is unchanged.

- [Play](https://ragingaxolotl-art.github.io/kingdoms-council-game/)
- [Teacher guide](https://ragingaxolotl-art.github.io/kingdoms-council-game/guide.html)
- [Frozen versions](https://ragingaxolotl-art.github.io/kingdoms-council-game/versions.html)
- [Detailed v0.9 game](https://ragingaxolotl-art.github.io/kingdoms-council-game/releases/v0.9.0/)
- [Google Doc release log](https://docs.google.com/document/d/10C8coQ2kA-Ke__oLZ-MsJOgsX2qdp4iU8zmbIygRmQc/edit)

## The classroom cycle

1. **Plan:** choose a country; Economy allocates held resources for next-round delivery. Military recruits whole regiments using its delivered account and save one destination and move/capture order per piece. Two starting units, six maximum. Nobody moves yet.
2. **Agreements and targets:** the teacher moves everyone simultaneously. Arrows record each step. Countries sharing land choose a target country or hold, exchange mutually accepted alliance offers, and confirm their choices.
3. **Retreat:** the teacher resolves a simultaneous combat exchange. Weaker damaged forces choose one adjacent safe territory; trapped units surrender. The teacher finishes retreats.
4. **Results:** captures, territorial income and movement research complete. Read the battle blocks and download map pictures. Students construct their own report tables. The teacher starts the next turn.

## Small rules with meaningful choices

Original map polygons remain for biomes; contiguous cells inside each original country become larger territories. Each connected country component gets up to five chunks (roughly one per 18 cells). Capitals begin controlled, other chunks unclaimed. Isolated islands are separate and have no sea route in this version.

Each regiment is one type with 100 starting health. Spears beat cavalry, cavalry beat archers, archers beat spears. Artillery is neutral against every type, including other artillery. It costs the same as spears/cavalry for now; its city-capture role will arrive with city mechanics. Health is surviving troop count; damage persists. Base damage is 30% of starting health, with ×1.5 advantage or ×0.75 disadvantage. A regiment attacks once, sharing damage among the selected country's units in proportion to health. All attackers' contributions add before rounding and applying losses. Resolution order does not grant first-strike advantage.

Mutually accepted allies targeting the same country gain ×1.5; an attacker receiving a direct attack back from its target gets normal coordination damage instead. Type, fatigue and pursuit still apply. Attacking an ally breaks that agreement after the exchange. Alliances persist until broken, while unanswered offers expire next turn.

Movement begins at two adjacent territories, researched up to four. Routes can cross empty foreign land; hostile occupied land can be entered but not crossed. Meetings interrupt movement. Opposite edge crossings meet at the lower-numbered territory. Entering rough ground reduces attack by 15%, capped at 30%, for that cycle. Terrain fatigue does not remove health.

A damaged country with less surviving health than the strongest country at the site retreats; ties hold. Retreat is one adjacent territory without hostile troops and preserves health. If two enemies retreat into the same previously empty space, their encounter waits until the next cycle. During the next cycle, moving retreat-marked units take ×2 damage from a previous attacker if caught; the mark then expires.

Capture requires reaching the ordered destination and being the sole remaining country after retreats. Passing through does not capture. Allied co-occupants also leave ownership disputed. Ownership persists when empty. Territory production uses area-weighted food/wood biome potential and a 0.5–1.5 size multiplier relative to mean territory area. Money is 8 times that multiplier, rounded. Coastline adds 2 food. Separate fixed low/medium/high deposits yield 4/8/12 metal; deposits are assigned deterministically, with at least one per original country. Cell subdivision does not multiply resources. Production enters Treasury after retreats. Recruitment is available at controlled existing settlements without hostile troops, costs Military funds, and takes one round to become ready. Training units cannot move/capture or attack offensively; they can retaliate against the country their side selected if that country attacks them, at half attack strength. They take normal damage. Recruitment costs 50 money, 20 food, and either 20 metal + 5 wood (spears/cavalry/artillery) or 20 wood + 5 metal (archers). Movement research spends the separate Research account and costs 60 money, 15 wood and 15 metal and helps next turn.

## Department funding

Economy allocates money, food, wood and metal in whole amounts from current Treasury holdings. Each valid input saves live. Pending allocations reserve resources immediately, can be revised or canceled during planning, and deliver to Military or Research only at round-end. Departments spend during the next planning round. Unspent delivered balances persist; new allocations do not repeat automatically. Unallocated funds remain in Treasury. Forecast production cannot be allocated early.

Example: allocate in round 1, recruit after delivery in round 2, move those regiments in round 3. Initial regiments are ready on round 1. Research uses delivered Research resources and completes its own funded project at the end of the round.

v1 regiment saves upgrade once: existing stocks remain in Treasury, existing units are ready, departments start at zero, and the map gains fixed production/deposits and capital recruitment sites. Already-saved simplified campaigns did not retain imported town data, so reimport the original Full JSON into a new game to use all its settlements. New Full JSON imports retain named capital cities and noncapital towns. No settlement construction or siege bonus is introduced.

## Saves, scope and classroom use

The campaign format is now `council-regiments-v2`, with independent browser storage `council-regiments-v0.10`. Download/Open game preserves the whole state. Previous phase restore swaps the last checkpoint with the current state. Failed phase calculations leave state unchanged. Unreadable saves pause autosave and can be downloaded for recovery. Downloads are the durable backup if local browser storage fills.

The host controls all countries. There are no student logins, private orders, networking or teacher authentication yet. Imported Azgaar Full JSON supplies geometry and biomes, not game ownership, armies or treaties. The new campaign starts fresh. PNGs cannot supply traversable territory geometry. Naval transport, healing, detailed education, economy laws and trade are outside this small mode; the full v0.9 game and its save slot remain in the version library. Resource geography is asymmetric; classroom balance needs playtesting.

## Validation and development

Serve `dist/` with `python3 -m http.server 8040 --bind 127.0.0.1`. Run every `tests/*.cjs` except files ending in `browser.cjs` with Node. New UI test: `node tests/regiments-browser.cjs` (Playwright + Chrome; optional `GAME_URL`, `BROWSER_PATH`, `PLAYWRIGHT_MODULE`). Earlier browser suites target the archived detailed interface rather than the new default.

Regiment regressions cover connected territories, movement limits and meetings, interrupted captures, persistent ownership/income, type advantages, multiple attackers, mutual vs coordinated attacks, pursuit, surrender, retained health, consent, resource costs, research timing, transactional failure, save rejection and 20 complete turns. Browser verification covers orders, recruitment, alliances, target confirmation, combat/retreat, zoom and biomes, PNG/JSON downloads, save reload and narrow layouts. All historical rule suites still run in CI, and immutable release hashes protect every old archive.

## Sources

Geography/import foundations and the full biome palette derive from Azgaar Fantasy Map Generator (MIT). D3 Delaunay supplies Voronoi geometry (ISC, with dependency notices). Licenses are in `dist/vendor`. The regiment rules are original classroom abstractions, not historical predictions or the full Azgaar battle engine. Detailed prior mechanics remain in [HISTORY.md](HISTORY.md).
