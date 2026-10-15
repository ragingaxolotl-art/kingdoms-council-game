# Classroom sessions — implementation and deployment

Status: implemented and tested locally on the isolated `classroom-sessions` branch, based on committed v0.17 gameplay. Live Supabase provisioning and production verification are still pending. The existing `index.html` and local game are unchanged.

## Teacher walkthrough

1. Open `classroom.html`, choose Teacher, and sign in with your provisioned teacher account.
2. Create a named class. Use a new world, the browser's existing Regiment save, or an uploaded downloaded game. The shared game is independent of the original save.
3. Expand **Assign a student**, enter a short label or nickname, and select their country and department. Generate the PIN and give it privately to the student. PINs are six digits, unique within the class, and shown once.
4. Share the class link. Students enter only their PIN. They are assigned their country and department by the server.
5. The roster shows connection and readiness. Use Change assignment to move a student, Reset PIN for a lost PIN, and Disable to revoke access. Each change revokes previous student sessions.
6. Students save decisions and mark ready. Changing a country’s plan makes its team review and mark ready again. Pending incoming offers also invalidate the recipient’s readiness.
7. Use the teacher phase button to move the class forward. Refreshing either device reloads the saved phase; it does not advance the game.
8. Download game backups from the teacher dashboard. The file remains compatible with the local game’s Open game control. Backups contain gameplay, not classroom PINs or login tokens.

## Student yearly flow

| Screen | Student task | Teacher transition |
| --- | --- | --- |
| Start the year & plan | Check current supplies; Economy allocates delivered budgets and negotiates trades; Military recruits/equips and saves movement; R&D arranges cooperation, funds research and manages city facilities. | Finish plans and move everyone. |
| Respond (when needed) | Military reviews meetings, accepts alliances, saves targets or holds, then confirms readiness. Other roles see a waiting checklist. | Resolve responses and simultaneous battles. |
| Results & final actions | Review battles. Military chooses safe retreats and shared capture ownership; Economy confirms civilian food for every owned territory. | Finalize the year in one saved transaction. |
| Year-end summary | Read production, civilian/military food use, department deliveries, discoveries, territory changes and final next-year balances; review objectives and mark ready. | Start next year. Supplies are not awarded again. |

Responses skip automatically only when there are no encounters and no pending alliance offers. Trades and research cooperation remain part of planning because existing rules require agreement before research funding. Unassigned countries still need teacher decisions; select each country/department in the teacher dashboard. Readiness override bypasses readiness only, never missing required gameplay decisions.

Funding timing is preserved: pending allocations reserve current Treasury resources; production, deliveries and military meals settle at year-end. Departments can spend their delivered balances during next planning. New production cannot fund the civilian food plan that was already due. A year-end summary distinguishes produced resources from deliveries and final account balances.

## Architecture

- `core.cjs` wraps the existing pure game engine with an explicit action allowlist, server-side role/ownership checks, required-decision checks, per-student readiness, idempotency receipts and resource summaries.
- `service.mjs` is a shared Fetch API handler used in local Node and Supabase Edge deployments. Teacher tokens are verified with Supabase Auth; students exchange a class-scoped PIN for a 12-hour opaque bearer session. Student sessions use no email address.
- PIN lookup uses a keyed SHA-256 HMAC with a private server pepper; PINs are not stored in clear text. Bearer tokens are stored hashed. Shared, atomic database rate limits cover class, client network and attempted PIN. Reset/disable/reassignment revoke prior sessions.
- Session commits use database compare-and-swap on a storage version. Command revisions reject stale decisions; request IDs make retries safe. Phase resolution is calculated on a copy and committed once. No student endpoint accepts replacement game state.
- Projections omit other countries’ private balances, unsubmitted movement orders and city facilities. City facilities are visible to the assigned R&D view. Teacher identity is verified independently of any body role flag.
- Screens check the service every 2.5 seconds while visible. Unchanged polls authenticate against compact metadata, without loading the whole game or map; teacher heartbeats update only connections; reconnects retrieve the current state. This first implementation uses polling, not a WebSocket dependency. Database/hosting load should be measured with the intended class size before general deployment.
- Form drafts are not reported as saved. An incoming revision preserves current draft fields until the student chooses Review latest; phase changes discard obsolete unsubmitted entries with an explanation. Readiness cannot discard an unsaved form. Local browser reload preserves server-saved decisions.
- Geometry and game state remain compatible with the existing engine. Generated ESM rule copies are rebuilt from the checkout; do not hand-edit generated files.

## Live deployment (pending connection)

1. Provision a Supabase project under the user’s account and apply `supabase/migrations/202610140001_classroom.sql`. The three tables have RLS and no anon/authenticated table grants. Only the service role can read them or call the rate-limit function.
2. Set private function secrets `CLASSROOM_PIN_PEPPER` (at least 32 random characters) and `CLASSROOM_ORIGIN=https://ragingaxolotl-art.github.io`. Platform `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` remain server-only.
3. Run `node scripts/build-classroom.cjs`, then deploy `supabase/functions/classroom`. `verify_jwt=false` is intentional because students use opaque tokens; the handler itself verifies every protected request. Never remove those handler checks.
4. Provision the teacher’s confirmed Supabase Auth account. Students are classroom memberships, not Auth accounts. The UI uses teacher email/password sign-in and token refresh. Do not commit teacher passwords, access tokens, service keys or the PIN pepper.
5. Set only public `api`, `supabaseUrl` and `publishableKey` in `dist/classroom-config.js`. The API URL is the deployed classroom Edge Function. Supabase signup policy and teacher onboarding must be verified during provisioning.
6. Deploy the classroom front end via the existing GitHub Pages workflow after integration. Until the API is configured, the classroom page clearly says setup is pending and links to the existing local game.
7. Verify live teacher login, two independent student devices, simultaneous saves, reconnect, PIN revocation, a full year, account isolation, and denied direct database access. Verify production proxy headers used for IP rate limiting. Confirm resource/compute costs with realistic class size.

## Local verification

Use Node 22 or newer:

```
node scripts/build-classroom.cjs
node tests/classroom-session.cjs
node tests/classroom-api.mjs
node tests/classroom-storage.mjs
node tests/classroom-supabase-store.mjs
```

Start the local-only preview with `CLASSROOM_PREVIEW_PASSWORD` set to a test password of at least 12 characters, then run `node classroom/preview.mjs`. It binds only `127.0.0.1:8057`. The preview password is deliberately separate from production Supabase authentication. `.classroom-data/` is ignored, kept on the SSD, and persists preview classes across server restarts.

Verified manually with independent teacher/student browser tabs: create class, assign PIN, sign in, save funding, readiness on teacher roster, automatic phase update, food confirmation, student refresh recovery, all-country final decisions, year-end supplies and backend restart recovery. All 20 existing rule/archive suites plus the classroom session suite passed after integrating v0.17; API security/concurrency tests passed separately. Live database migration, Supabase teacher sign-in and deployed-device testing are not yet verified.
