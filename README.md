# Council & Crown — v0.8

A separate, host-controlled strategy game for sixth graders. The classroom heraldry project is untouched by this repository.

- [Play](https://ragingaxolotl-art.github.io/kingdoms-council-game/)
- [Frozen versions](https://ragingaxolotl-art.github.io/kingdoms-council-game/versions.html)
- [Teacher guide and GitHub building blocks](https://ragingaxolotl-art.github.io/kingdoms-council-game/guide.html)
- [Google Doc release log](https://docs.google.com/document/d/10C8coQ2kA-Ke__oLZ-MsJOgsX2qdp4iU8zmbIygRmQc/edit)

## Active research and living settlements (v0.8)

Research has national discoveries and a separate local development queue. National research now spends a resource kit alongside its money budget: agriculture uses food/wood, engineering wood/metal, and armaments metal/cloth. Supplies scale with actual funding; shortages pause discovery progress without charging its money. Economy sees the requested supplies.

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

Run every `tests/*.cjs` rule test except files ending in `browser.cjs` with Node. Browser tests require Playwright and Chrome; set `PLAYWRIGHT_MODULE`, `BROWSER_PATH`, and optionally `GAME_URL` for another installation. Serve `dist` with `python3 -m http.server 8025 --bind 127.0.0.1`.

Checks cover resource/trade conservation, typed casualties, supply cutoffs, multi-army ordering, phases, voting, research, objective alternatives, real archived-save migration, malformed save rejection, Full JSON import, 100-turn development, research supplies and targeted projects, population-conserving migration, renaming, browser recovery, image loading and responsive layout. Release SHA-256 checks prevent accidental changes to frozen versions. GitHub Pages deployment runs rule checks before publication.

## Scope and sources

No student accounts, join codes, multiplayer synchronization, naval movement/trade or intermediate cargo interception yet. Initial country size affects difficulty. Classroom playtesting remains necessary; automated tests establish rule consistency, not classroom balance.

Azgaar geography/import foundations and battle phase weights are adapted under MIT; this is not the full Azgaar combat engine. D3 Delaunay supplies Voronoi geometry under ISC, with dependency notices in `dist/vendor`. Research SVG illustrations and classroom rules are original. Candidate GitHub integrations are documented in the on-site guide; they are not installed merely because they are listed. Earlier milestone notes are in [HISTORY.md](HISTORY.md).
