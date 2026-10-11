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
- Check account usage between milestones. Stop and pause the goal at a safe checkpoint when roughly 25% remains, with 20–30% acceptable. Last check: 45% used / 55% remaining. Do not consume down to zero.

## Milestones
- v0.1.0: deployed baseline; frozen local archive preserved.
- v0.2.0: phases, settlement votes, alliance renewals, shields, highlights, release library, IndexedDB checkpoints. Released and archived; Google Doc updated.
- v0.3.0: distinct resource stocks and production chains, storage, civilian population and accepted trade with conservation tests.
- v0.4.0: mixed troop composition/transfers, connected supply and simultaneous multi-army battles, terrain bonuses; released and deployed successfully.
- v0.5.0: illustrated research achievements, education costs/learning, saved per-field progress; released and deployed successfully.
- v0.6.0: implemented and tested the latest user steering: simplify stocks to food, wood, metal, cloth and money (plus only clearly necessary abstractions). Add multiple country objectives achievable through different development paths: prosperity, learning, diplomacy, security. Finish research first, then do this simplification at the next mechanics milestone.
- Final: integrated long-run tests, import/restore validation, user-friendly explanations, verified published version history.

## Runtime
Node: /Users/timetravellog/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
Playwright package: /Users/timetravellog/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright
Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
Local preview: python3 -m http.server 8025 --bind 127.0.0.1 (cwd dist). Browser/network operations need escalation on this host.
GitHub repository: ragingaxolotl-art/kingdoms-council-game
Publish by pushing main, then check the Pages Actions result and live URL.
