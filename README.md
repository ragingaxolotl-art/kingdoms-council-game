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
