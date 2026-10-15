The existing game saves in one browser and lets its host switch every country and role. This adds a separate classroom entry point where a teacher assigns a country and department to each student PIN, decisions are checked and saved by a shared service, and student screens follow teacher phase advances.

The student flow is Start & Plan → Responses when needed → Results & Final Actions → Year-End Summary. Reports distinguish production, meals, deliveries and final balances while preserving v0.17 funding, research, objectives and attack-disruption rules. The existing local game and frozen releases are preserved.

Includes teacher roster/readiness, PIN reset and reassignment, per-role commands, private student projections, stale-write rejection, idempotent phase advances, durable local preview, Supabase SQL/Edge deployment files, CI and teacher/student walkthroughs.

Interrupted saves survive reload and repeated lost replies, retaining the original action ID until confirmation. Presence outages cannot conceal committed game saves.

Validation: all 20 existing rule/archive suites plus five classroom suites pass. Manual browser verification with independent teacher/student tabs covers PIN assignment/login, saved funding, readiness, automatic phase updates, refresh recovery, year-end supplies, backend restart and reassignment revocation.

Draft: live Supabase provisioning, production teacher sign-in, database migration/permission verification and live multi-device testing require the Supabase connection. Public classroom config is intentionally empty. This branch must not replace the live game until those deployment checks are complete.
