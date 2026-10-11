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
