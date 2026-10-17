# Battle Lab

Open https://ragingaxolotl-art.github.io/kingdoms-council-game/battle-lab/battle-online.html.

Create a two-player match and share its link and six-digit PIN. Each player controls one of the two farthest-separated starting capitals, edits their test army, and confirms each stage with Ready. The existing combat engine resolves both players together. Land production funds Military directly; research and civilian economy management are disabled. Both players can agree to replay the original setup from Results. Browser refresh reconnects the saved player seat; matches expire after seven days. The single-use invitation expires after 24 hours.

Four-country solo testing is at battle-lab/battle-lab.html. This release only adds the self-contained dist/battle-lab directory; existing game and immutable archives are unchanged.

Implementation source: https://github.com/ragingaxolotl-art/kingdoms-council-game/tree/codex/battle-lab-source (source commit fd47498). Source branch contains the server, exact SQL migration, deterministic builders and regression/browser tests. The isolated Supabase battle-lab function uses existing project bnmghtjwolplmdjwgpyl. No client contains a service key. Supabase security checks confirm no direct browser table/function grants. Server-only RLS tables intentionally have no client policies.

Verified: PIN join and own-country permissions, hidden plans and targets, two-player simultaneous transitions, stale writes, duplicate/lost-response recovery, full battle/retreat/income cycle, replay, browser refresh, mobile layout, and live Supabase two-browser play. All 16 troop-type matchups match the original combat engine.
