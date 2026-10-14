# v0.9 detailed-game reference

# Council & Crown — v0.9

A separate, host-controlled strategy game for sixth graders. The classroom heraldry project is untouched by this repository.

- [Play](https://ragingaxolotl-art.github.io/kingdoms-council-game/)
- [Frozen versions](https://ragingaxolotl-art.github.io/kingdoms-council-game/versions.html)
- [Teacher guide and GitHub building blocks](https://ragingaxolotl-art.github.io/kingdoms-council-game/guide.html)
- [Google Doc release log](https://docs.google.com/document/d/10C8coQ2kA-Ke__oLZ-MsJOgsX2qdp4iU8zmbIygRmQc/edit)

## Choices & consequences (v0.9)

Economy divides stored food plus the next harvest into people, army, experiments and reserves. Shares total 100%; each is a maximum use, and unused food remains in storage. Regular, small and generous portions alter civilian needs and happiness. People may go hungry when their share is too small even if food is reserved elsewhere. Army food refills connected regiments' packs; cut-off troops use carried food. The planner previews needs, and Results records actual use. Trade, events, spoilage and capacity limits happen afterward.

R&D divides its money budget among food, engineering and equipment research. Each field keeps its progress and consumes its own resource kit. The money available after upkeep, laws and schooling scales the three shares proportionally. Missing supplies pause that field; its unspent money remains available for later turns, without automatic redistribution. Kits are checked in displayed field order when materials are scarce. Completed fields leave their share unspent. School research points are split by those same shares.

Six curricula connect education to the world: broad education (+1 happiness), vocational skills (+50% construction and mining/forestry/weaving/housing work, +25% engineering research, −1 happiness), agricultural science (+15% food, +50% irrigation work, +25% agriculture research), advanced scholarship (+50% all research, −2 happiness), community/citizenship (+2 happiness, −10% research), and military training (+25% equipment research, +2 readiness for fed regiments, −1 happiness). Literacy and education costs still matter. Work bonuses shorten completion to whole Results phases; benefits start after completion.

R&D also chooses persistent service, work and community-support laws. Conscription can move 10 residents into infantry each turn, using 10 money, 4 metal, 2 cloth and 10 military allowance. A settlement must retain at least 25 residents. Military can select a preferred home regiment; otherwise an eligible regiment or new reserve receives recruits. The law imposes −3 happiness and +6 unrest pressure each turn even when material or allowance shortages block recruitment. Longer workdays add 15% money/wood/metal/cloth but cost 2 happiness and add 4 unrest pressure. Worker protections reduce those outputs 10% and add 2 happiness with −4 pressure. Community kitchens consume 5 money and one food per 550 residents (rounded up) from the people share, granting +3 happiness and −4 pressure only when fully funded.

Unrest evolves from happiness, law pressure and shortages, capped 0–100. It changes negative social-event probability from 4% at zero unrest to 40% at maximum unrest; positive social probability falls from 12% to 4%. Natural events have an independent 18% chance, equally divided between helpful and difficult outcomes. Eight illustrated event types give bounded resource or happiness changes. Event draws depend on map seed, turn and country; loading a saved turn cannot reroll it. These are classroom game probabilities, not real-world claims. Law/food consequences and events affect happiness-driven migration.

New controls use colored allocation bars, illustrated research cards, school/law previews, unrest meters and country-specific event cards. All changes lock during Decide and Results. Existing v0.8 saves gain defaults without changing populations, towns or research progress. Older research focus becomes a 100% share of that field.

The active working copy and QA outputs are on the user's Extreme SSD: `/Volumes/Extreme SSD/Council-and-Crown/`. The earlier Downloads copy is preserved as the v0.8 fallback and is no longer the development location.

## Active research and living settlements (v0.8)

Research has national discoveries and a separate local development queue. National research now spends a resource kit alongside its money budget: agriculture uses food/wood, engineering wood/metal, and armaments metal/cloth. Supplies scale with actual funding; shortages pause the affected field without charging its money. Economy sees the requested supplies.

R&D can improve a specific mine (+40% metal), farm (+30% food), lumber camp (+35% wood), or weaving workshop (+40% cloth), or develop housing (+120 capacity, +8 happiness) and public health (+6 happiness). Economy grants a separate local-project spending allowance (initially 60 money). These projects require that allowance, the appropriate building and upfront resources, take two or three turns and are limited to one active project per country. Canceling returns the unused time share; capture loses the project and its committed supplies. All three roles have a visible turn checklist.

New starter maps begin with a named capital and two named towns where there is enough land. Existing residents are redistributed into them, conserving population. Imported cities/towns keep their locations and names, with noncapital settlements treated as towns. Existing campaigns gain the new mechanics without free settlements being inserted. During Implement, players can propose further towns/cities and rename their owned settlements and regiments.

At Results, residents gradually move to a neighboring cell at least six happiness points better, with available housing. National morale, shortages, occupation, enemy presence, schools, settlements and local R&D affect happiness. Borders at war block migration. At most about 4% of a source cell moves per turn, while at least 25 residents stay; this is movement, not birth/death growth. Housing limits arrivals. People affect labor, revenue, upkeep and recruiting. Happiness and Population & housing map layers make these changes visible.

## Current mechanics

Implement → Decide → Results. Economy sets policies and shared budgets; research funds education and twelve illustrated discoveries; military recruits four troop types, transfers troops, moves regiments cell by cell and manages diplomacy. Meetings, treaty renewals and unanimous settlement votes resolve before results. All countries and roles are controlled on one site for testing.

Five stocks: money, food, wood, metal and cloth. Geography, labor, morale, buildings and research affect yields. Settlements and weaving workshops increase cloth; cities add food, revenue and storage. Trades require recipient consent, exchange goods atomically and deliver after land-route travel time. Food spoils and storage is limited. Connected supply and carried food determine army readiness. Multi-army battles apply simultaneous skirmish and melee casualties with terrain and research modifiers.

Four visible shared achievements allow alternative routes to prosperity, learning, diplomacy and security. Conditions must hold for three turns; badges persist and the sandbox continues. These are preliminary classroom balance targets.

## Maps and recovery

The starter has all 13 Azgaar biomes. Import Azgaar Full JSON for cell polygons, biomes, countries, cities and diplomacy. Game population, yields and armies are generated game values. Imports support 5–200 countries and at most 100,000 cells, subject to browser capacity. Shields, highlights, zoom and clickable settlements are available.

Automatic phase checkpoints and opening-save checkpoints retain the latest 18 states in IndexedDB. Restoring first backs up the current campaign. Phase calculations are validated on a copy before replacing live state. Download campaigns for durable backups. Archives are immutable and have separate localStorage save slots; checkpoint history is shared within the site. Older versions may reject newer saves.

The current browser key is `council-crown-game-v0.2` for continuity. Upgrading pre-v0.6 saves combines timber + stone + materials into wood, iron + equipment into metal, and gives 40 cloth once. This is a game simplification, not a physical recipe. Trades preserve their quantities, and old proposals preserve their reserved costs. A pre-v0.6 save first opened by v0.7 is retained for download if browser storage permits. Already migrated saves cannot reconstruct their former raw stocks; use an older checkpoint or downloaded backup.

## Validation

Run every `tests/*.cjs` rule test except files ending in `browser.cjs` with Node. Browser tests require Playwright and Chrome; set `PLAYWRIGHT_MODULE`, `BROWSER_PATH`, `QA_DIR` (screenshots/downloads), and optionally `GAME_URL` for another installation. Serve from the repository with `python3 -m http.server 8031 --bind 127.0.0.1 --directory dist`. Use `GAME_URL=http://127.0.0.1:8031` for browser tests.

Checks cover resource/trade conservation, typed casualties, supply cutoffs, multi-army ordering, phases, voting, research, objective alternatives, real archived-save migration, malformed save rejection, Full JSON import, 100-turn development, research supplies and targeted projects, population-conserving migration, renaming, browser recovery, image loading and responsive layout. v0.9 adds allocation conservation, every curriculum effect, funded laws, conscription conservation, actual v0.8 migration, deterministic event probability checks, and 50 turns of varied policies. Release SHA-256 checks prevent accidental changes to frozen versions. GitHub Pages deployment runs rule checks before publication.

## Scope and sources

No student accounts, join codes, multiplayer synchronization, naval movement/trade or intermediate cargo interception yet. Initial country size affects difficulty. Classroom playtesting remains necessary; automated tests establish rule consistency, not classroom balance.

Azgaar geography/import foundations and battle phase weights are adapted under MIT; this is not the full Azgaar combat engine. D3 Delaunay supplies Voronoi geometry under ISC, with dependency notices in `dist/vendor`. Research SVG illustrations and classroom rules are original. Candidate GitHub integrations are documented in the on-site guide; they are not installed merely because they are listed. Earlier milestone notes are in [HISTORY.md](HISTORY.md).


# v0.6 — Five resources and kingdom goals

The current game has five stocks: money, food, wood, metal and cloth. Forests favor wood, deposits favor metal, and grasslands/savannas/wetlands favor fibers and herds for cloth. Weaving workshops and settlements add cloth. Buildings and troop types use different combinations. Cities provide more income, food, cloth and storage; upgrading a village replaces it rather than stacking two settlements.

Four shared achievements offer alternative routes: prosperity through settlement growth or trade; learning through schools or broader discoveries; diplomacy through a wider alliance or more trade; security through forts or military research. Conditions must hold for three results in a row. Progress is visible; badges remain earned and do not end the sandbox.

Old saves migrate once: timber + stone + materials become wood; iron + equipment become metal; old campaigns receive 40 cloth. Old trade quantities and shipments keep their quantities under the new names. Existing settlement proposals retain their old reserved costs. These are simplified classroom abstractions, not physical conversion recipes. Archived v0.5 retains the earlier system and its own save slot. Export a campaign before switching versions.

Verified with rule, trade conservation, objective, old-release migration and browser tests. Goals are preliminary classroom balance targets; they still need playtesting with students. Geography scale, passive income and starting country size affect difficulty.

# v0.5 — Discoveries and education

Twelve original illustrated achievements show what research unlocks. Agriculture adds food, engineering adds resource production, and armaments add military strength. Changing fields preserves progress. Education consumes money and improves learning; completed fields stop spending research funds. Pictures tell the discovery story without adding physical inventory items.

Validation: research unit checks plus the full browser campaign flow (including image loading, council votes, supply-related controls, saved turns, and mobile layout).

# v0.4.0 — Regiments and supply

Recruit infantry, archers, cavalry or artillery crews. All types draw ten people from the cell; costs differ. Split a regiment or transfer a chosen type to another regiment in the same cell. Unit counts must always add up to the regiment total.

Supply checks require an unblocked path through owned/allied cells to one of your cities, villages or depots within eight cells. Food is carried and consumed; disconnected or underfed troops lose readiness. Forts and elevated/home territory help defenders. Soldiers no longer consume a second national food charge in addition to carried rations.

Combat now resolves every engaged regiment simultaneously in two phases. Skirmish/melee weights are adapted from Azgaar's MIT-licensed Battle Simulator documentation; this is not the full Azgaar engine. Losses are allocated exactly to troop types. Swapping enemy regiments encounter each other; three-army results are tested against reversed list order. All allies remain protected from attacks.

Tests added: military.cjs (recruitment/transfer conservation, supply disconnection, simultaneous multi-army order independence, typed casualty accounting, crossing encounters). Browser tests cover troop transfers as well as earlier workflows.

# Current milestone: v0.3.0 — Resources and trade

The latest game includes Implement → Decide → Results, unanimous settlement votes, shields, country highlights, version archives and automatic IndexedDB checkpoints. Use Versions & changes to play a frozen release; use Restore turn to restore a campaign checkpoint. Each archive has its own browser save key. Downloads remain the portable backup.

Resource stocks now distinguish timber, stone, iron, building materials, equipment, food and money. Biome/elevation/seeded deposits determine cell raw yields. Lumber camps, quarries and mines improve extraction. Settlements and workshops turn 2 timber + 1 stone into 1 material; workshops turn 2 iron + 1 material into 1 equipment. Production stops when an input is missing. A storehouse increases capacity; excess goods are reported as lost and food spoils at 1% per turn.

Trade offers require the recipient's consent in Decide. Accepted agreements attempt three shipments over three turns. Both sides pay atomically or neither pays. Cargo is held in transit for land travel time and paused during war between its endpoints. There is no sea trade or intermediate-country interception yet. Cargo is included in conservation tests. Materials/equipment cards identify manufacturing rather than claiming raw cell production.

Validation: engine.cjs, phases.cjs, economy.cjs, releases.cjs and browser.cjs. The browser suite tests the proposal/acceptance UI as well as existing council flows and recovery.

The older prototype description below is retained for historical context; current behavior above supersedes differences.

# Council & Crown — separate strategy game prototype

A new website independent of `heraldry-battle-simulator`. No classroom source files or saves are shared or modified. GitHub Pages serves `dist/` through the included Actions workflow. The unrelated experimental Sites registration is unused and unpublished; its local metadata is ignored by Git.

## Play

Choose a country, inspect a map cell, and switch among Economy, Research, and Military. All roles and countries are controlled locally by the host for testing. Advance Turn resolves every country. There are no student codes, accounts, remote saves, or AI decisions yet. Do not use this prototype as a shared multiplayer session.

The seeded starter uses all 13 standard Azgaar biomes. Full JSON imports preserve Azgaar polygons, country geography, biomes, and settlement positions; game yields, population, resources, troops, and technologies are new prototype values. Imports require 5–200 countries. PNG maps are intentionally unsupported because cells need real geometry.

Each land cell has population, biome-based production, buildings, occupation, and construction. All owned cells contribute money, food, and materials. Workshops also convert two materials into one equipment, up to 0.6 equipment per turn. Gross output cards do not subtract upkeep or equipment inputs.

Economy sets taxes/relief, research funding, recruitment spending permission, and construction. Research chooses education and one research focus; changing focus resets unfinished research. Military recruits infantry from residents, splits troops and supplies into regiments, issues land routes and engagement orders, and proposes agreements. Recruitment allowance is a spending cap drawn down by purchases, not extra money and not automatically replenished.

## Turn sequence

Production → population/military upkeep → education/economic morale effects → research funding/progress → regiment food supply → movement → encounters → occupation → construction and research completion. Completed buildings and research affect subsequent turns. Schools contribute at most three research points nationally per turn. Education and economic policies persist; they do not stack when reselected.

Paths use shared polygon edges and weighted Dijkstra routing. Each regiment moves one cell per turn; taiga, tundra, and glaciers take two turns. No naval movement. Alliances require the receiving council's acceptance; declaring war is immediate. Neutral territory can be traversed in this sandbox. Engagement rules, not merely the relationship, initiate fights. Crossing enemy regiments also encounter one another. Avoiding armies attempt to retreat to an unoccupied friendly neighbor; otherwise they defend. Each regiment fights at most one pairwise encounter per turn, in stable list order. Surviving opposing armies can remain in contested cells. Combat is deliberately simple and deterministic; it is not Azgaar's full Battle Simulator. Occupation requires hostile territory and no other country's living regiment at that cell.

## Isolation and saving

Browser key: `council-crown-game-v1`, separate from the classroom app's key. Download/Open Campaign backups include complete geometry and all game state. Unreadable existing saves pause autosave to preserve the original data. Large imported worlds may exceed browser storage; download backups when warned. All uploaded files are processed in the browser.

`original-project-checksums.json` records the classroom project's source hashes before work began, excluding its Git metadata. No original files should change.

## Development

Serve `dist/` with `python3 -m http.server 8025 --bind 127.0.0.1`. Open http://127.0.0.1:8025.

Run `node tests/engine.cjs`. Browser tests use Playwright; set `PLAYWRIGHT_MODULE`, `BROWSER_PATH`, and `GAME_URL` when necessary, then run `node tests/browser.cjs` with the server running.

## Next iterations

- Validate economic balance with classroom playtests; starting geography is intentionally asymmetric.
- Distinct raw commodities, trade agreements, warehouses, and transport.
- Population growth, education deployment, meaningful seasonal effects, and victory conditions.
- Multiple troop types, equipment allocation, richer terrain combat, and Azgaar Battle Simulator adaptation.
- Simultaneous multi-army encounters and supply routes.
- Student join codes, role permissions, server-controlled turns, and synchronized campaigns.

## Attribution

Biome palette/classification and the import foundation derive from Azgaar's Fantasy Map Generator under MIT. D3 Delaunay provides Voronoi geometry under ISC, with its bundled dependency licenses. License files are in `dist/vendor/`. The seed generator/import files and Gria template were copied from the separate classroom app; game economy and combat rules are new illustrative simulations. Hosted font styling uses Google Fonts with system fallbacks.
