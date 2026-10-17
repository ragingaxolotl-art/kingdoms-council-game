# Two-player Battle Lab

Public entry point: https://ragingaxolotl-art.github.io/kingdoms-council-game/battle-lab/battle-online.html

Create a match, share its link and six-digit PIN, and let the other player join on a separate browser/device. Each seat controls one of the two most widely separated original capitals. The four-country solo laboratory remains separate. The host does not have access to the other player's commands. Both players must ready each phase; normal combat, retreat and capture rules resolve on the server. The test army editor closes when both players finish setup. Results supports a mutual replay request restoring the original setup.

## Service

`battle-lab` is an isolated Supabase Edge Function in the existing Council and Crown project. `schema.sql` is the exact `battle_lab_two_player_rooms` migration applied through Supabase MCP. `battle_lab_rooms` and `battle_lab_limits` have RLS and deny anon/authenticated access; only service_role uses them. The rate-limit function is SECURITY INVOKER with an empty search_path and revoked public execution. Security advisors report intentional RLS-without-policy informational notices for these server-only tables; no new security warning is outstanding.

The function checks opaque 256-bit player tokens on every state/command request and stores only their SHA-256 hashes. Room-scoped invitation PINs use HMAC with the existing server-only classroom pepper, never exposed to browsers. Invite links contain only room IDs. An invitation expires after 24 hours and binds the second seat once. Successful join and create can be retried with the same browser token after lost responses. Matches expire after seven days; existing sessions can resume only while that browser keeps its local storage. No email/Auth signup or new paid project is required.

Commands are an explicit server-side allowlist. Ownership is inferred from the authenticated seat, never from a client country field. State replacement is unsupported. A compare-and-swap version prevents concurrent lost updates. Request receipts deduplicate successful commands. The client persists an outbox before sending; unknown outcomes retry the same ID, while a stale revision requires review. Opponent orders, targets and retreat selections are stripped from projections. Polls at 2.5 seconds (10 seconds hidden) authenticate against compact metadata and avoid reading/sending geometry for unchanged revisions.

`verify_jwt=false` is required for opaque PIN sessions; the handler performs its own authentication. Service keys are read only from Supabase runtime environment. Existing classroom handlers/configuration and teacher login are not changed. Classroom private_config is read only for the existing PIN pepper, using a separate HMAC namespace.

## Build / verification

Run `python3 scripts/build-battle-lab.py`, then `node scripts/build-battle-online.cjs`. The build generates ESM copies of the current rules and a deterministic two-country seed. The edge bundle lives under `supabase/functions/battle-lab`. The original combat implementation stays unchanged; Battle Lab changes only neutral production, civilian feeding and direct military funding.

Run `node tests/battle-lab.cjs`, `node tests/battle-online.mjs`, and `node tests/battle-online-browser.mjs` with the local web preview on port 8042. Set BATTLE_LIVE=1 to verify the real Supabase service; set BATTLE_URL to the public page for an end-to-end published test. Browser tests create disposable matches with independent browser contexts. Tests cover PIN/seat isolation, denied ownership and origin, hidden plans, setup locks, stale concurrent saves, duplicate requests, lost database acknowledgements, normal damage/retreat/income, replay, empty successful database responses, browser refresh and mobile layout.

The additive public `dist/battle-lab/` directory is published from an isolated checkout of current main. The full game and version archives remain unchanged. Source changes are saved on the separate implementation branch; deployment records identify the source commit.
