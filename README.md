## v0.27 illustrated research

The supplied artwork appears beside R&D project previews, the current project, completed discoveries and the prerequisite catalog. It covers Bronze/Iron/Steel equipment, Simple/Recurved/Longbows, Organized marches, Road networks, Crop rotation, Irrigation, Sawmilling and Mining tools. Labels and benefits come from the existing research catalog. The original transparent sheets are preserved and displayed as separate clipped icons; the marching group stays together. Costs, research order, saves and rules remain unchanged. Asset provenance is in `dist/research-icons/README.txt`.

## v0.26 map navigation and country highlights

Map controls now include directional pan buttons, centered zoom, Fit map, Find my kingdom, Find my troops and a kingdom finder. Drag empty map space with a mouse or one finger to pan; pinch with two fingers to zoom, or use trackpad pinch. The focused map accepts arrow keys, +/− and Home. A second finger cancels any pending troop drag before switching to map navigation. Camera movement stays inside map bounds and never resolves or changes game orders.

Gold outlines mark the active country’s land and gold frames identify its troops across departments. Each highlight can be toggled. Choose another kingdom for a cyan outline and troop frames, or All countries for the political colors and country names. Find actions frame the requested holdings or living troops; the country used for game actions stays unchanged. Highlights appear in downloaded maps, and navigation works on Resources and Happiness views.

## v0.25 troop map controls

The supplied troop artwork replaces map tokens. Each icon has its regiment number and a green health bar (50–100 health) or red bar (below 50). Military can drag its ready troops within their existing movement limits; the picture follows the pointer and remains at its planned destination with a route arrow until the teacher resolves movement. Click a troop to see its number, health and equipment level, and use its separate Hold or Capture buttons. Hold defends at the planned destination without claiming; Cancel movement returns its plan to its current territory. Destination controls above the map remain available for keyboard use. Other countries’ troops, training/resting units and non-planning phases remain protected.

Military territory details show claimed status, ownership and country shield (a colored initial shield if none is uploaded), settlement level, current production and defense only. Construction stays in Economy. No engine, balance, save schema or paused authentication changes.

## v0.24 metallic defense overlays

Palisades use the supplied wooden fence with a metallic silver outline; Stone Walls and Citadels use the supplied stone wall with a metallic gold outline. Fortified settlements display the matching defense across their front at 118% of the settlement icon width, on the map and in Economy/R&D panels. Map PNG exports include both layers. Construction, capture, repair and upgrade rules remain unchanged.

## v0.23 ordered settlement artwork

Five supplied settlement pictures now mark Village (red), Small Town (orange), Town (yellow), City (green) and Great City (blue). Scaled, clickable map icons grow with zoom; a numbered illustrated key and upgrade path show the order and current/next level. Economy offers only the next settlement stage, retaining the existing one-construction-per-round, research, cost and repair requirements. PNG map exports include the artwork. The Resources layer keeps its separate production markers.

## v0.22 troop illustrations

Military recruitment now shows illustrated cards for Spears, Archers, Cavalry and Artillery with their resource costs and research requirements. Existing regiments show the matching picture beside their name and health. The supplied three-figure sheet was separated into transparent image variants; the swordsman is saved for reuse without adding a new unit rule. Cavalry background was made transparent; artillery uses the supplied image.

## v0.21 department resource cards

Military and R&D each show four rounded cards above their controls, with the supplied material pictures, available amounts and live spending totals. Totals are separate per country and department, survive saves and phase rollback, include military meals, and reset for the next round. Refunds do not erase spending already recorded. Older saves show “Spent since opening” until the next round because past spending was not recorded.

## v0.20 resource pictures and map

The teacher-supplied money, food, wood and metal artwork appears beside allocation controls, with stronger card/input borders and explicit material labels. Trade uses small icons beside each material name. Choose **Resources** in the map’s View menu, then hover, tap or keyboard-focus an icon for its per-round production; filter by material or zoom for dense areas. The display uses the engine output at 50 happiness, retaining settlement and research/specialty bonuses without editing the game. Resource map PNG exports include the icons. Historical versions remain frozen. The separate live classroom sign-in verification remains paused.

## Student site

Open [Student sign-in](https://ragingaxolotl-art.github.io/kingdoms-council-game/student.html) or [explore the student screens](https://ragingaxolotl-art.github.io/kingdoms-council-game/student.html?preview=1). The practice preview has all three departments and four phases, including final supplies. Live PIN sign-in is connected to the classroom service. Teachers use the approved email’s sign-in link; students need only their class link and PIN. [Teacher classroom](https://ragingaxolotl-art.github.io/kingdoms-council-game/classroom.html) and [classroom deployment notes](classroom/README.md) cover the prepared shared service.

## v0.17 — Attacks disrupt exchange

Resolved attack choices and sieges/captures of owned land break bilateral alliances, cancel joint research, and cancel pending exchanges with exact trade-escrow refunds. Domestic research keeps its normal progress but receives no joint extra progress, refund or cooperation objective credit. All three exchange types are blocked in both directions through the next round. A full quiet round restores them; another attack renews the wait. Completed trades and knowledge are not rolled back, and third-party exchanges remain available. Neutral captures and peaceful movement do not trigger this rule. UI warnings show the affected countries and recovery round. Schema v8 adds a validated bilateral attack ledger; old campaigns retain all assets and objective evidence without invented historical wars.

Validation: `tests/regiment-disruption.cjs` covers attack and siege triggers, pending refunds, independent/third-party research, historical transfers, all exchange guards, repeated attacks, cooldown recovery, neutral claims, weak-unit captures and real v0.16 migration. `tests/regiment-disruption-browser.cjs` exercises actual agreements, funding, attack choices, UI locks, persistence, mobile warnings and restored controls after a quiet round.

## v0.16 — Always-open departmental objectives

Three independent objectives per department, no mission selection. Countries may pivot throughout the campaign. Completing any three objectives across at least two departments earns victory at round-end; simultaneous winners share it and play may continue. Permanent awards and streak/evidence ledgers survive saves. Schema v7 preserves old assets while starting new objective accounting; it does not invent historical trades or funded discoveries.

Economy rewards sustained feeding/happiness, real construction plus production growth, and substantial lasting two-way trade. Military rewards stable new holdings, equipped/supplied formations, and intact garrisoned fortifications. R&D rewards six self-funded discoveries across branches, four distinct shared/joint discoveries involving two partners, and six useful active city actions across four rounds and two facility types. There are no bonuses for early achievement that could create a runaway resource advantage. See the in-game teacher guide for exact thresholds.

Trade credit nets opposite transfers against prior flows, removing reversed round credit. Gifts, tiny/identical exchanges, offer cancellation and replay do not qualify. Knowledge forwarding and repeated copies of one technology do not inflate research credit. Failed city actions and surplus academy progress do not count. The existing no-copyable-assignment-table rule remains.

Validation includes `tests/regiment-objectives.cjs`, `tests/regiment-objectives-browser.cjs` and `tests/regiment-objectives-balance.cjs`. The reproducible balance snapshot is `tests/objective-balance-v0.16.json`: nine 30-round campaigns, three maps and three policies, 135 country runs. Median completed victory rounds: peaceful 11, defense 13, science 13; completion counts 40/45, 45/45, 42/45. All nine objectives and all three paired-department routes were reached using earned resources. Additional inactivity and midgame-pivot campaigns pass. Geography and scripted-policy limitations still cause long tails; this is a tested starting balance for classroom playtesting, not proof of equal difficulty or exhaustive optimal play.

# Council & Crown — v0.15 Regiment game

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

Each regiment is one type with 100 starting health. Spears beat cavalry, cavalry beat archers, archers beat spears. Artillery is neutral against every type, including other artillery. It costs the same as spears/cavalry for now; it deals double siege damage to settlement defenses. Health is surviving troop count; damage persists. Base damage is 30% of starting health, with ×1.5 advantage or ×0.75 disadvantage. A regiment attacks once, sharing damage among the selected country's units in proportion to health. All attackers' contributions add before rounding and applying losses. Resolution order does not grant first-strike advantage.

Mutually accepted allies targeting the same country gain ×1.5; an attacker receiving a direct attack back from its target gets normal coordination damage instead. Type, fatigue and pursuit still apply. Attacking an ally breaks that agreement after the exchange. Alliances persist until broken, while unanswered offers expire next turn.

Movement begins at two adjacent territories, researched up to four. Routes can cross empty foreign land; hostile occupied land can be entered but not crossed. Meetings interrupt movement. Opposite edge crossings meet at the lower-numbered territory. Entering rough ground reduces attack by 15%, capped at 30%, for that cycle. Terrain fatigue does not remove health.

A damaged country with less surviving health than the strongest country at the site retreats; ties hold. Retreat is one adjacent territory without hostile troops and preserves health. If two enemies retreat into the same previously empty space, their encounter waits until the next cycle. During the next cycle, moving retreat-marked units take ×2 damage from a previous attacker if caught; the mark then expires.

Capture requires ready capture-order regiments at the ordered destination, being the sole remaining country after retreats (or a cooperating joint settlement capture), and reducing the territory’s defense health to zero. Passing through does not capture. Shared settlement captures use unanimous ownership decisions; other co-occupations leave ownership disputed. Ownership persists when empty. Territory production uses area-weighted food/wood biome potential and a 0.5–1.5 size multiplier relative to mean territory area. Money is 8 times that multiplier, rounded. Coastline adds 2 food. Separate fixed low/medium/high deposits yield 4/8/12 metal; deposits are assigned deterministically, with at least one per original country. Cell subdivision does not multiply resources. Production enters Treasury after retreats. Recruitment is available at controlled existing settlements without hostile troops, costs Military funds, and takes one round to become ready. Training units cannot move/capture or attack offensively; they can retaliate against the country their side selected if that country attacks them, at half attack strength. They take normal damage. Current unit recipes, technology prerequisites and paid re-equipping are defined in regiments-development.js and displayed before recruitment. Research now uses one project with separately funded rounds rather than the old one-payment movement upgrade.

## Food, happiness and balance

New games start with 120 Treasury food. Each territory has a base need of 1–3 civilian food based on area relative to the map's average territory (below 0.75 average: 1; above 1.25: 3; otherwise 2). Settlement levels raise this to max(base need, level), up to 5. In Retreat & feed, each country's economist assigns food from current unreserved Treasury holdings and confirms. A zero ration is allowed but must be explicit; a missing plan blocks teacher completion. Plans do not spend until completion and cannot exceed the pool. Future production and department balances cannot fund civilian rations.

Full rations add 10 happiness; shortages subtract round(30 × missing fraction), bounded to 0–100. Base production is multiplied by (0.5 + happiness/100) and the settlement multiplier, then rounded per resource and territory. Initial happiness is 60. Food is applied before retreat/capture; a new owner then resets the territory to exactly 0, including unclaimed land, and starts feeding it the following retreat phase. This preserves the conquest penalty even if the old owner fed it just before capture. Half output at zero happiness leaves room for recovery.

Military upkeep automatically consumes 1 food per surviving regiment, including trainees, after pending departmental deliveries. The country takes 1 + 0.5 × missing fraction incoming damage during the next round. Full meals restore the multiplier to 1. Empty armies need zero food. No health is removed directly for missing food; the increased battle damage is the penalty. Recruitment now uses 4 food rather than 20, keeping ongoing provisioning meaningful. Training still halves outgoing counterattack damage.

Food cycle: confirm civilian allocations → consume civilian food/update happiness → retreats/captures/reset captured happiness → collect happiness-adjusted production into Treasury → deliver department allocations → deduct military meals/set next-round shortage penalty → Results. These operations are one transactional round-end update. New production does not fund the already-confirmed meal or delivery. All new fields are saved; schema v2 migrates once without a food gift or changing existing allocations. Existing territories begin at happiness 60 because prior saves did not track it.

Balance is preliminary. A large starting reserve gives time to expand into productive land. Recruiting to the six-unit maximum regardless of food surplus can create shortages; the economist sees forecast production minus civilian and army needs. Three 30-round strategies test sustainable expansion and recruitment using actual earnings rather than injected supplies.

## Department funding

Economy allocates money, food, wood and metal in whole amounts from current Treasury holdings. Each valid input saves live. Pending allocations reserve resources immediately, can be revised or canceled during planning, and deliver to Military or Research only at round-end. Departments spend during the next planning round. Unspent delivered balances persist; new allocations do not repeat automatically. Unallocated funds remain in Treasury. Forecast production cannot be allocated early.

Example: allocate in round 1, recruit after delivery in round 2, move those regiments in round 3. Initial regiments are ready on round 1. Research uses delivered Research resources and completes its own funded project at the end of the round.

v1 regiment saves upgrade once: existing stocks remain in Treasury, existing units are ready, departments start at zero, and the map gains fixed production/deposits and capital recruitment sites. Already-saved simplified campaigns did not retain imported town data, so reimport the original Full JSON into a new game to use all its settlements. New Full JSON imports retain named capital cities and noncapital towns. Settlement levels and persistent siege defenses are now included.

## Saves, scope and classroom use

The campaign format is now `council-regiments-v3`, with independent browser storage `council-regiments-v0.10`. Download/Open game preserves the whole state. Previous phase restore swaps the last checkpoint with the current state. Failed phase calculations leave state unchanged. Unreadable saves pause autosave and can be downloaded for recovery. Downloads are the durable backup if local browser storage fills.

The original local game below remains teacher-hosted. The separate student/classroom site implements authenticated shared sessions; production sign-in still needs backend provisioning. Imported Azgaar Full JSON supplies geometry and biomes, not game ownership, armies or treaties. The new campaign starts fresh. PNGs cannot supply traversable territory geometry. Naval transport, healing, detailed education, economy laws and trade are outside this small mode; the full v0.9 game and its save slot remain in the version library. Resource geography is asymmetric; classroom balance needs playtesting.

## Validation and development

Serve `dist/` with `python3 -m http.server 8040 --bind 127.0.0.1`. Run every `tests/*.cjs` except files ending in `browser.cjs` with Node. New UI test: `node tests/regiments-browser.cjs` (Playwright + Chrome; optional `GAME_URL`, `BROWSER_PATH`, `PLAYWRIGHT_MODULE`). Earlier browser suites target the archived detailed interface rather than the new default.

Regiment regressions cover connected territories, movement limits and meetings, interrupted captures, persistent ownership/income, type advantages, multiple attackers, mutual vs coordinated attacks, pursuit, surrender, retained health, consent, resource costs, research timing, transactional failure, save rejection and 20 complete turns. Browser verification covers orders, recruitment, alliances, target confirmation, combat/retreat, zoom and biomes, PNG/JSON downloads, save reload and narrow layouts. All historical rule suites still run in CI, and immutable release hashes protect every old archive.

## Sources

Geography/import foundations and the full biome palette derive from Azgaar Fantasy Map Generator (MIT). D3 Delaunay supplies Voronoi geometry (ISC, with dependency notices). Licenses are in `dist/vendor`. The regiment rules are original classroom abstractions, not historical predictions or the full Azgaar battle engine. Detailed prior mechanics remain in [HISTORY.md](HISTORY.md).

## Settlement construction and siege (v0.13)

Click a territory on the map (or select it with the keyboard selector) to open the upgrade box over the map. Economy can build on controlled territory during planning, from unreserved Treasury. No hostile troops may be present. One construction or repair is allowed per territory per round. New benefits apply immediately; production still arrives only at round-end. Multiple imported settlements in a cluster share one upgrade level and one defense pool, avoiding many individual decisions.

Five sequential stages: Village (1), Small Town (2), Town (3), City (4), Great City (5). Their production bonuses are +25%, +50%, +75%, +100%, +150% to each existing resource output, before happiness; an absent mineral deposit still produces no metal. Defense health is 40, 70, 110, 160, 220. Food need is max(original land need, settlement level), never above 5. Each next level costs 40 × target level money, 20 × target level wood and 5 × target level metal.

Three sequential fortifications: Palisade, Stone Walls, Citadel add 60, 140, 240 health respectively (replacement tier bonuses, not cumulative). Their costs are 35 × target tier money, 20 × target tier wood and 15 × target tier metal. Upgrades require full current defense health. Repairs restore up to 60 health for ceil(restored / 3) money and the same wood; they use the territory’s construction action.

After retreats, an uncontested capture force damages defenses once per round: 30% of current health per ready capture-order regiment, 60% for artillery, reduced by travel fatigue. Defenses are passive and do not damage troops. Siege damage persists without free healing. Cooperating countries can combine siege damage at settlements under the shared-capture rules below. Other disputed land receives no siege damage; hold/move orders and training units contribute none. Capture requires zero defense health, removes all fortifications, lowers the settlement two levels (minimum zero/open land), and leaves any remaining defenses ruined at zero. Happiness also resets to zero. Destroyed settlements cannot recruit until rebuilt.

Schema v4 upgrades genuine older saves without changing funds, troop health/readiness or existing happiness. Existing cities map to level 4, towns to 3 and villages to 1; empty land starts at 0. This raises output and food demand for existing cities. A save opened mid-retreat must reconfirm food because needs may have changed. Historical releases remain immutable and playable.

## Shared settlement captures (v0.14)

During Retreat & feed, surviving countries can jointly take a settlement when every remaining country has ready capture-order troops, the old owner is absent after planned retreats, and participants did not attack each other this round. They do not need a formal alliance. Their siege damage adds together. A city whose defenses remain above zero stays with its current owner and needs no ownership vote yet. Empty land retains the sole-country rule.

When the defenses will reach zero, each participating country submits a recipient (one of those countries) or No agreement. The shared-capture block appears regardless of department. Everyone must explicitly submit; missing votes block teacher completion transactionally, without consuming food or causing damage. Votes can be revised, saved and reloaded. Changes to ordinary retreat choices clear the votes because the final occupation may change.

Unanimous selection awards ownership to the chosen country with normal conquest damage: two settlement levels lost, all fortifications destroyed, zero happiness and zero remaining defense health. Other participating troops can remain there. Different choices or any No agreement destroy the entire settlement and fortifications and leave the land unclaimed at zero happiness. All occupying troops withdraw exactly one adjacent territory, preserving health, with their arrival route preferred; another safe neighbor is used otherwise. No safe adjacent territory means surrender under the existing retreat rule. Every withdrawal is planned from the same occupation snapshot, logged and drawn as a movement arrow. Forces sharing a destination can meet in a new conflict next round. Diplomatic withdrawal does not add a combat-pursuit mark. No ruined-land income is awarded that round.

Schema v5 adds a capture-agreement ledger without changing resources, city levels, troop health or food plans. Genuine v0.13 saves migrate once. Tests cover voting, dissent, missing votes, persistence/revision, army withdrawal, ongoing siege, combat exclusions, safe-route failure and migration.

## R&D, active cities and exchange (v0.15)

Added regiments-development.js (pure rules) and regiments-development-ui.js. Save schema v6 preserves old resources, unit health and equipment baseline, existing city levels and captures. It adds technology/progress, national specialties, city facility/action state, paid gear tiers, trade escrow and research partnerships. Existing movement research remains honored. The browser key remains unchanged; all archives stay independent.

Research branches: metallurgy (Copper/Bronze/Iron/Steel), archery (Simple/Recurved/Longbow), horsemanship (Riding/Saddles/Stirrups), engineering (settlement and defense levels, artillery unlock and manufacturing), logistics (movement 3/4), agriculture (food production), industry (wood production), and civics (facilities). The catalog contains exact recipes, prerequisites and 2–4 required progress. Costs are paid per funded round, not a single total. Only one national project can be funded each round. Progress is preserved when switching unfunded projects. Discoveries complete at round-end and affect later production. No safe controlled settlement means paid research cannot progress.

Each country receives a deterministic Agriculture/Industry/Metallurgy specialty, adding 25% food/wood/metal output and discounting that branch’s installment costs by 25% (rounded up). Full biome mixtures and original deposits still determine resource availability. Countries do not receive extra stock on migration. The R&D graph plots actual income history for four resources, with discovery/capture/trade annotations; it does not mix Treasury spending into production.

Knowledge sharing requires an offer and recipient acceptance; it is free but requires prerequisite knowledge. Joint research requires matching selected projects and consent before funding, one partner per country per round. Both parties pay their own installment from delivered Research funds. If both remain operational and fund the same technology, both get +1 progress and a 25% refund (floor per resource). Partnerships expire after that round. This is cheaper and faster, not unlimited free progress. Capturing a level-4/5 city creates one choice of its prior owner’s discoveries; that territory can grant archives only once per capturing country. The source keeps its discovery; razed shared-capture cities give no archives.

Economy retains settlement/fortification construction, now research-gated: Construction for level 2/palisades; Masonry for level 3/stone walls; Planning for level 4; Architecture for level 5/citadels. Existing cities remain usable. R&D manages city interiors in the map popup and installs discovered facilities from its delivered budget. Facility slots equal settlement level. Installations share the one-construction-per-territory quota; every settlement separately has one paid active ability each round.

Hospital: 35 money/25 wood/10 metal to build; 8 money/6 food to treat one ready, damaged, stationary unit for 20 HP after a peaceful fully supplied round. Workshop: 30 money/20 wood/20 metal to build; spend 5 money/8 wood/4 metal for 12 military metal after the round. Academy: 40 money/30 wood/5 metal to build; 12 money/5 food adds one funded research progress, capped at one academy nationally per round. Granary: 25 money/30 wood/5 metal to build; transfer 6 Research food to Treasury with a 2-money fee. Civic Hall: 35 money/25 wood/5 metal to build; spend 10 money/5 food for up to +10 happiness immediately. Hostile occupation or loss of control prevents pending local benefits. Capture trims facilities to remaining slots; razing removes all.

Military base recruitment recipes (money/food/wood/metal): spears 50/4/10/30; archers 50/4/30/10; cavalry 70/8/15/35; artillery 90/6/30/55. Higher equipment adds material cost and +10% field attack per tier, while keeping RPS advantages. New recruits use the best known tier; existing troops must pay for re-equipping and rest for the round. Re-equipping costs per tier: 20 money plus 15 wood/5 metal for archers, or 5 wood/20 metal for others. Artillery has no gear progression; Manufacturing discounts its recipe 20% (rounded up). Fully supplied troops fighting on owned land receive 0–5% morale attack as local happiness rises from 50 to 100.

Economy trade is negotiated in whole-resource bundles from unreserved Treasury. Proposer resources are escrowed immediately; recipient acceptance checks and pays its bundle before either delivery. Cancellation, rejection and round-end expiry refund pending escrow exactly. Accepted trades cannot be replayed. Incoming resources enter Treasury and retain the existing departmental delivery delay. No fixed exchange rate is imposed.

R&D-only city views are presentation boundaries on the teacher’s shared device, not authenticated student privacy. This milestone does not add multiplayer accounts. Students still make their own Google Docs tables; no report table export exists.

## Military map orders (v0.18)

During planning, choose Military and drag one of your regiment tokens onto a highlighted territory. The map previews its legal route and movement count. Choose Move / hold or Move & capture beside the map before dragging. Dropping saves the order; the token stays in its current territory until the teacher advances all countries. Dashed arrows show saved plans. Invalid drops and Escape preserve the previous order. Training/resting units and other countries remain locked. Find on map zooms to a regiment; the existing Destination and Plan controls remain available for keyboard use. Happiness uses a dark-red-to-bright-blue heat map with a labeled legend.

Verified with movement-controller tests, existing regiment/happiness/archive suites, and browser checks for move/capture dragging, invalid drops and refresh persistence.
