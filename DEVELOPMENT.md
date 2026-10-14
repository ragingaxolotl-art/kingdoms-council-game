## v0.13 settlements and map upgrade box

User requested five ordered settlement levels with substantial production boosts, up to five civilian food, three fortifications and harder city capture. Added territory-level development, paid immediate Treasury construction in planning (one action per territory/round), persistent passive siege health, artillery double siege damage, paid repairs, capture removing all fortifications and two settlement levels, and schema v4 migration. User additionally requested clicking a territory to open an upgrade box on the map; this is the primary construction UI, with keyboard selector/Escape support and mobile layout. Existing cities become level 4 and towns 3; imported settlements in one cluster share one level/defense pool. No new accounts/multiplayer or assignment-table export.

## v0.12 happiness and food follow-up

User requested an economist happiness map, happiness-dependent production, a large food pool, required civilian feeding during retreats (1–3 per territory), automatic military food consumption with more damage on shortage, and zero happiness for captures. Added schema v3 with migration preserving stock, new-game Treasury food 120, recruitment food 4, happiness 60 initially / 0 on capture, output multiplier 0.5–1.5, full meal +10 and missing food up to −30. Civilian confirmation is required; armies eat one food per survivor after deliveries and take up to 1.5× damage next round. Territory-food planning precedes captures; newly acquired land starts feeding next retreat phase. Sustainable expansion/recruitment balance tests supplement shortage and conservation regressions. Do not assume every geography supports a maximum army.

## v0.11 economy and training

User chose the four-stock mixed-biome economy and separate Military/Research/Treasury allocations, delivered after a full round. Additional instruction: recruits take another round and can defend at a penalty. Implemented live saved allocations, reserved pending deliveries, separate spendable accounts, area-weighted biome food/wood, modest area-scaled money, fixed visible mineral deposits, coastal food, settlement-only recruitment, readyTurn training and half-strength counterattacks. No new settlement-building UI. Schema v2 migrates existing v1 balances into Treasury without creating funds; original regiments are ready. Existing simplified saves only retained capitals; new Full imports preserve towns as well.

## v0.10.1 artillery follow-up

User confirmed artillery neutral against all types, intended primarily for future city capture. Added recruitable 100-health artillery with standard movement, costs and damage; no city bonus yet because this mode has no city mechanic. Cavalry still beats archers and loses to spears. Keep the v0.10 browser key and schema for campaign continuity.

# Latest user direction: v0.10 simplified regiments

The user explicitly requested a smaller Risk-like game and delegated gameplay choices. This supersedes the detailed role/city-vote requirements below for the new default mode. Preserve the complete published v0.9 archive and its resources, curricula and laws.

Current workspace supplied by the user: /Volumes/Cyber Pet Workspace/Codex Projects/WMSA/kingdoms-game. The old Downloads project is a symlink here. Fetch origin before publishing: the older local copy was missing published v0.9, now integrated. Prior SSD paths below are historical.

Implemented grouped territories, whole 100-health RPS units, capped recruitment, captured-land income, 2–4 researched movement, four teacher phases, consent-based alliances, country targets, simultaneous multi-attacker damage, fatigue, retreat and pursuit. New files are regiments-engine.js, regiments-app.js and regiments.css. The new save schema and browser key are separate from the detailed game. Preserve no-table-export classroom requirement.

Validation: new rule tests and browser tests plus all historical rule suites. Headless Playwright use was explicitly authorized after the regular browser tool failed on the moved workspace symlink. Released v0.10.0 at commit 4b4fe3e. GitHub Pages run 38645274301 succeeded; the full new browser suite passed against the public URL. The native Google Doc v0.10 section was appended and read back. Original Gria Full JSON validated: 3,562 land cells → 72 territories, 15 countries. Current usage check: 7% used / 93% remaining at completion.

# Active development goal

Keep the finished classroom simulator separate. Develop this repository only. GitHub Pages is the deployment target; do not use the unused Sites registration. Full biome geography remains the map foundation.

## User constraints
- Sixth graders: use readable explanations, map highlights, visual achievements and icons.
- Implement → Decide → Results. In Decide, review meetings, renew treaties, and vote on settlements.
- Every new city/village needs economy, research and military approval.
- Shield uploads and clickable settlements/highlights are required.
- Research eventually uses images such as Plow or Irrigation; achievements change relevant numerical stats rather than simulate physical objects.
- Host controls every role for now; accounts/join codes are deferred.
- Keep immutable playable releases on the website and safe campaign rollback.
- Add regression and browser tests with each mechanics milestone.
- Maintain the native Google Doc: https://docs.google.com/document/d/10C8coQ2kA-Ke__oLZ-MsJOgsX2qdp4iU8zmbIygRmQc/edit
- User authorizes relevant open-source code/libraries and independent design/mechanics choices. Retain licenses and document reuse.
- Check account usage between milestones. Stop and pause the goal at a safe checkpoint when roughly 25% remains, with 20–30% acceptable. Last check: 51% used / 49% remaining. Do not consume down to zero.

## Milestones
- v0.1.0: deployed baseline; frozen local archive preserved.
- v0.2.0: phases, settlement votes, alliance renewals, shields, highlights, release library, IndexedDB checkpoints. Released and archived; Google Doc updated.
- v0.3.0: distinct resource stocks and production chains, storage, civilian population and accepted trade with conservation tests.
- v0.4.0: mixed troop composition/transfers, connected supply and simultaneous multi-army battles, terrain bonuses; released and deployed successfully.
- v0.5.0: illustrated research achievements, education costs/learning, saved per-field progress; released and deployed successfully.
- v0.6.0: implemented and tested the latest user steering: simplify stocks to food, wood, metal, cloth and money (plus only clearly necessary abstractions). Add multiple country objectives achievable through different development paths: prosperity, learning, diplomacy, security. Finish research first, then do this simplification at the next mechanics milestone.
- v0.7.0: integrated 100-turn strategy tests, strict nested save validation, preserved imported diplomacy, transactional phase calculations, pre-v0.6 original-save download, automatic replacement checkpoints, building explanations and teacher/GitHub guide. Released and verified on the live website.

## Runtime
Node: /Users/timetravellog/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
Playwright package: /Users/timetravellog/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright
Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
Local preview: python3 -m http.server 8025 --bind 127.0.0.1 (cwd dist). Browser/network operations need escalation on this host.
GitHub repository: ragingaxolotl-art/kingdoms-council-game
Publish by pushing main, then check the Pages Actions result and live URL.

## v0.8 user follow-up
Give R&D active, resource-consuming local projects with different economic outcomes; establish starter towns/cities; move population with happiness and housing; allow owned settlement/regiment names; keep all roles influential and legible. Implemented targeted mining/farming/forestry/weaving/housing/health projects, discovery kits, population-conserving migration, map layers, renaming and role checklists. Rule, browser and 100-turn campaign tests passed. v0.8 was frozen, published and recorded in the Google Doc. Continue honoring the 20–30% remaining-usage stop boundary.

## v0.9 user follow-up and SSD location
Working copy: /Volumes/Extreme SSD/Council-and-Crown/kingdoms-game
All new saved QA artifacts: /Volumes/Extreme SSD/Council-and-Crown/verification
The Downloads working copy remains an untouched v0.8 backup. Use the SSD copy for all future development; user explicitly requested SSD storage. External-drive writes need sandbox escalation. Core.filemode is false because the SSD does not preserve Unix executable modes. Ignore macOS ._* sidecars and exclude them from release archives.

Implemented food allocation/ration plans, parallel research shares, six curricula affecting production/work/research/readiness, R&D laws, funded population-conserving conscription, unrest-linked social events and independent natural events. Saved deterministic outcomes, visual dashboards, resource request previews and phase locks. Actual v0.8 migration test, 50-turn varied-policy test, new browser workflow and existing 100-turn achievement strategy pass. The local SSD preview uses port 8031. v0.9.0 was frozen and published at commit 05290aa. GitHub Pages run 38103809447 succeeded. The live new-mechanics workflow and frozen-archive save isolation passed; the native Google Doc v0.9 section was appended and read back successfully. All eleven rule suites and four browser suites passed. Live screenshots are in verification/v0.9-live on the SSD.

Current Results order: accepted votes/renewals → production → food shares/civilian consumption → army pay → laws/conscription/happiness/unrest → education → research kits → military food → battles/capture → construction → trades → events → storage/discoveries/rounding → local development → migration → achievements. Movement happens in Decide preparation. Finished buildings and discoveries improve later production.
