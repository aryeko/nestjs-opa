
🚀 Codex: Build a world-class OSS repo aryeko/nestjs-opa

You will create a polished pnpm workspaces monorepo that helps NestJS services use OPA (with the SpiceDB plugin) + TypeORM for ReBAC. The packages are the product; the Smart Home app is just a sample that consumes them. When done, everything must build, test, and run end-to-end with docker compose. Include CI and a benchmark harness.

Repo: https://github.com/aryeko/nestjs-opa
License: MIT
Node: 20+
Style: TypeScript strict, ESLint, Prettier, Typedoc
Test: Vitest or Jest (your choice), plus opa test for Rego
Versioning: Changesets
Publish: npm later (no token now)

⸻

❗ Non-negotiable architecture
	•	Single PDP: OPA runs Rego and calls SpiceDB via OPA–SpiceDB plugin built-ins. The Nest app does not call SpiceDB for authorization decisions.
	•	AuthN: JWT verified in Nest (use jose).
	•	AuthZ flow: @Authorize() decorator → global guard builds a typed OPA input (app-provided builder) → OPA decision {allow} (via @styra/opa TS SDK).
OPA handles RBAC (+ action allowlist) and ReBAC via SpiceDB plugin.
	•	Deny-by-default: any route without @Authorize() is 403. Public routes must use @Public().
	•	TypeORM outbox: subscribers write relationship deltas; a scheduled writer syncs SpiceDB (interval configurable).

⸻

📦 Workspace layout (create exactly)

nestjs-opa/
├─ packages/
│  ├─ nestjs-opa-core/            # @arye/nestjs-opa-core (generic)
│  ├─ nestjs-opa-rego/            # @arye/nestjs-opa-rego
│  └─ nestjs-spicedb-writer/      # @arye/nestjs-spicedb-writer (optional add-on)
├─ examples/
│  └─ smarthome-api/              # sample app that uses the packages
├─ bench/
│  ├─ seed/                       # dataset generators
│  ├─ scenarios/                  # k6 scripts
│  ├─ reports/                    # JSON+md outputs
│  └─ README.md
├─ docs/
│  ├─ getting-started.md
│  ├─ architecture.md
│  └─ troubleshooting.md
├─ .github/
│  ├─ workflows/ci.yml
│  ├─ workflows/e2e.yml
│  ├─ workflows/bench-smoke.yml
│  └─ workflows/release.yml
├─ .changeset/
├─ package.json
├─ pnpm-workspace.yaml
├─ .editorconfig
├─ .gitignore
├─ LICENSE
└─ README.md


⸻

📦 Package 1: @arye/nestjs-opa-core (generic)

Goal: Domain-agnostic glue for Nest ↔ OPA.

Exports
	•	Authorize(spec) and Public() decorators.

export type AuthorizeSpec = {
  action: string;            // e.g., "camera.stream"
  resourceType?: string;     // e.g., "device_camera"
  resourceIdParam?: string;  // where to pull id from req
  unauthenticated?: false;
};


	•	AuthzModule.forRoot(options) and AuthzGuard.
	•	OpaService (thin wrapper over @styra/opa).
	•	Generic types:

export type OpaInput<TSub = any, TEnd = any, TReq = any> = {
  subject: TSub; endpoint: TEnd; request: TReq;
};
export type OpaDecision<TExtra = unknown> = { allow: boolean } & TExtra;

export type AuthzOptions<TSub=any,TEnd=any,TReq=any,TDecExtra=unknown> = {
  policyPath?: string; // default 'authz/result'
  buildInput: (ctx: import('@nestjs/common').ExecutionContext, spec: AuthorizeSpec) => OpaInput<TSub,TEnd,TReq>;
  selectDecision?: (raw: unknown) => OpaDecision<TDecExtra>; // default: {allow: !!raw?.allow}
  resolveResourceId?: (req: any, spec: AuthorizeSpec) => string | undefined;
  verifyJwt: (req: any) => Promise<{ sub: string; roles?: string[]; [k:string]: any }>;
  opaClient?: { url: string; headers?: Record<string,string>; timeoutMs?: number };
};



Guard logic
	•	Verify JWT via options.verifyJwt.
	•	Read @Authorize / @Public. If neither and not public → 403.
	•	Build input via options.buildInput.
	•	Query OPA at policyPath using OpaService.
	•	Extract {allow} via options.selectDecision (default behavior).
	•	Enforce allow/deny (throw 401/403 as needed).

Unit tests
	•	Decorator metadata.
	•	Guard: public route allowed w/o JWT; protected route allow/deny based on decision; missing decorator → 403.

Build
	•	tsup/tsc, ESM+CJS, types, ESLint, Prettier, Typedoc.

⸻

📦 Package 2: @arye/nestjs-opa-rego

Goal: Rego policy (RBAC + ReBAC) and a bundle builder CLI.

Policy
	•	Path: data/authz/result → returns {allow: bool}.
	•	Expected input fields used by policy (document as “recommended contract”):
	•	input.subject.user_id (string)
	•	input.subject.roles (array of strings)
	•	input.endpoint.action (string)
	•	input.endpoint.resourceType (string or null)
	•	input.endpoint.hasDecorator (bool)
	•	input.endpoint.unauthenticated (bool)
	•	input.request.resourceId (string or null)
	•	input.request.now (RFC3339 timestamp for caveats)
	•	Logic:
	1.	Deny if missing decorator and not public.
	2.	Allow if public (unauthenticated: true).
	3.	RBAC via data/roles.json + data/actionMaps.json (action_to_perms).
	4.	If action is scoped (per scoped_actions), call SpiceDB plugin builtin:

resp := spicedb.check_permission(
  input.endpoint.resourceType,
  input.request.resourceId,
  data.action_to_spicedb_perm[input.endpoint.action],
  "user",
  input.subject.user_id,
  {"now": input.request.now}
)
resp.result == true

Else for unscoped, allow if RBAC permits.

	•	Include data files:
	•	roles.json (role → API permissions)
	•	actionMaps.json:
	•	action_to_perms
	•	scoped_actions (boolean per action)
	•	action_to_spicedb_perm
	•	CLI: build-bundle
	•	Emit dist/bundle/{authz.rego, data/*.json, .manifest}.
	•	.manifest revision = env BUNDLE_REVISION or "dev".
	•	Optional merge of user overrides in working dir.
	•	Policy tests (opa test):
	•	public allow
	•	missing-decorator deny
	•	unscoped RBAC allow/deny
	•	scoped allow path (with a fake resourceId and now)
	•	time window caveat pass/fail (see caveat below)

⸻

📦 Package 3: @arye/nestjs-spicedb-writer (add-on)

Goal: TypeORM outbox + scheduled writer to keep SpiceDB updated.

Includes
	•	AuthzOutbox entity: id, op(add|remove), objectType, objectId, relation, subjectType, subjectId, subjectRelation?, createdAt, processedAt, attempts.
	•	Subscribers (enqueue only; no remote I/O):
	•	Writes tuples for your sample app (see below).
	•	SpiceDbWriterService: setInterval driven by AUTHZ_WRITER_INTERVAL_MS (default 10000), batches 100–500, mark processed, retry increments.
	•	Unit tests for row→relationship mapping, happy path + retry.

⸻

🧪 Smart Home sample (examples/smarthome-api) — just a demo

Domain
	•	Home has Device Groups (rooms or nested subgroups). Devices live in groups:
	•	device_light, device_camera, device_thermostat.
	•	User roles per home: owner, admin, viewer, operator (NEW: can interact with devices—toggle lights, set thermostat—broader than viewer, less than admin).
	•	Invites can grant: viewer | operator | admin to home / device_group / device subset, optionally time-bounded (e.g., babysitter).
	•	User groups: nested groups for shared policies/time windows (e.g., “grandparents”); user_group nesting supported.

SpiceDB schema (implement exactly; include caveat):

definition user {}

definition user_group {
  relation member: user | user_group#member
}

definition home {
  relation owner:    user | user_group#member
  relation admin:    user | user_group#member
  relation viewer:   user | user_group#member
  relation operator: user | user_group#member

  permission manage  = owner + admin
  permission operate = manage + operator
  permission view    = operate + viewer

  permission manage_home_users = owner
}

definition device_group {
  relation parent: home | device_group
  relation manager:       user | user_group#member
  relation viewer:        user | user_group#member
  relation operator:      user | user_group#member
  relation camera_viewer: user | user_group#member

  permission manage      = manager + parent->manage
  permission operate     = operator + parent->operate
  permission view        = viewer + parent->view + operate
  permission view_camera = camera_viewer + parent->view_camera + parent->manage
}

definition device_light {
  relation parent: device_group
  permission manage = parent->operate
  permission view   = parent->view
}

definition device_thermostat {
  relation parent: device_group
  permission manage = parent->operate
  permission view   = parent->view
}

definition device_camera {
  relation parent: device_group
  permission view_camera = parent->view_camera + parent->manage
  permission view_meta   = parent->view
}

caveat within_time_window(now, start, end) {
  now >= start && now <= end
}

Entities (TypeORM, minimal)
	•	homes, device_groups (with parent: home or group), devices (id, groupId, kind: 'light'|'camera'|'thermostat')
	•	home_users (homeId, userId, role: 'owner'|'admin'|'viewer'|'operator')
	•	user_groups, user_group_members
	•	group_grants (groupId, subjectType 'user'|'user_group', subjectId, role 'viewer'|'operator'|'admin'|'camera_viewer', caveat JSON?)
	•	authz_outbox (from writer package)

Subscribers (enqueue to outbox)
	•	Map DB changes to tuples:
	•	home#owner|admin|viewer|operator@user|user_group
	•	device_group#parent@home|device_group
	•	device_*#parent@device_group
	•	device_group#viewer|operator|manager|camera_viewer@user|user_group [caveat: within_time_window]

App wiring
	•	Use @arye/nestjs-opa-core:
	•	AuthzModule.forRoot({ policyPath: 'authz/result', buildInput, selectDecision, verifyJwt, opaClient: {url: OPA_URL, timeoutMs: 300} })
	•	buildInput (example-specific) sets:
	•	subject.user_id & subject.roles (from JWT or quick lookup)
	•	endpoint.action, endpoint.resourceType, endpoint.hasDecorator=true, endpoint.unauthenticated=false
	•	request.resourceId (from route param), request.now (ISO timestamp), and any IDs helpful for listing
	•	Routes (HTTP only)
	•	POST /auth/login (@Public) → demo JWTs
	•	Homes: GET|PATCH /homes/:homeId → home.read / home.update
	•	Groups: GET|POST|PATCH|DELETE /homes/:homeId/groups → group.*
	•	Devices: GET|POST|PATCH|DELETE /groups/:groupId/devices → device.*
	•	Actions:
	•	POST /lights/:id/toggle → light.toggle → device_light.manage
	•	POST /thermostats/:id/set → thermostat.set → device_thermostat.manage
	•	POST /cameras/:id/stream → camera.stream → device_camera.view_camera
	•	Listing:
	•	GET /my/homes → homes user can view (you may use OPA+plugin lookup_resources in policy or filter in app by per-item check)
	•	GET /homes/:homeId/devices → only devices user can view (and cameras filtered unless view_camera)
	•	Seed script:
	•	Home A with groups: Parents, Kids, Living; devices (mix of lights/cameras/thermostats)
	•	Users: dad(owner), mom(admin), babysitter, grandma, grandpa, grandma2, grandpa2
	•	Grants:
	•	babysitter: viewer + camera_viewer on Kids group with within_time_window
	•	grandma: operator for all-lights-except-Parents via a precomputed device_group (document how you set this up); never camera_viewer
	•	Rego data (roles.json, actionMaps.json):
	•	Include operator role:
	•	operator → device.*.operate/light.toggle/thermostat.set actions (no admin actions)
	•	Map actions → SpiceDB permissions:
	•	home.read (unscoped; RBAC)
	•	home.update → home.manage (scoped)
	•	group.read|update → device_group.view|manage (scoped)
	•	group.operate → device_group.operate (scoped)
	•	device.list → device_group.view (scoped via group)
	•	light.toggle → device_light.manage (scoped)
	•	thermostat.set → device_thermostat.manage (scoped)
	•	camera.stream → device_camera.view_camera (scoped)

Docker compose (dev)
	•	postgres-app (app DB)
	•	spicedb-db + spicedb (authzed/spicedb) with preshared key
	•	opa (image that includes the SpiceDB plugin) running:

opa run --server
  --set=decision_logs.console=true
  --set=plugins.spicedb.endpoint=spicedb:50051
  --set=plugins.spicedb.token=spicedb_token
  --set=plugins.spicedb.insecure=true
  /policy/bundle

Mount packages/nestjs-opa-rego/dist/bundle as /policy/bundle

	•	api (sample app)
	•	In README, list the command to apply schema (spicedb schema write …), then run seed.

Example README must show curl flows:
	•	dad streams Parents camera → 200
	•	grandma toggles Kids/Living lights → 200, Parents lights → 403
	•	grandma streaming any camera → 403
	•	babysitter streaming Kids camera within window → 200, outside → 403
	•	viewer listing devices but unable to operate

⸻

📊 Benchmarks (bench/)
	•	Seed generator (bench/seed/generate-smarthome.ts)
	•	Options: --homes, --rooms-per-home, --nest-depth, --devices-per-room, --users-per-home, --camera-ratio, --light-ratio, --babysitter-share-ratio
	•	Write SpiceDB tuples directly using node client; optional PG rows.
	•	k6 scenarios (bench/scenarios/)
	•	list-devices.js (GET devices list per home)
	•	toggle-lights.js (POST light.toggle)
	•	stream-cameras.js (POST camera.stream)
	•	Profiles: small (10k tuples), medium (50k), large (100k); nesting depth 1/3/5
	•	Warm 30s, run 90s; record p50/p95/p99, RPS, error%
	•	Reports
	•	Save k6 JSON; produce markdown tables in bench/reports/
	•	Makefile / scripts
	•	make bench-small|bench-medium|bench-large
	•	Steps: build packages + bundle → compose up → apply schema → seed tuples → run scenario → write report

CI “bench-smoke”: tiny run (1k tuples, 10VUs, 20s) to validate harness.

⸻

🧰 Root tooling & CI
	•	Root package.json scripts: lint, build, test, test:policy, e2e, bench:smoke.
	•	ci.yml: Node 20, pnpm, lint, build, unit tests, opa test.
	•	e2e.yml: bring up example compose, apply schema, run minimal e2e:
	•	dad: POST /cameras/:id/stream (Parents) → 200
	•	grandma: stream any camera → 403; toggle Parents lights → 403; toggle Kids/Living lights → 200
	•	babysitter: stream Kids camera within window → 200; outside → 403
	•	route without @Authorize → 403
	•	/auth/login (public) → 200
	•	bench-smoke.yml: run small benchmark and upload report artifact.
	•	release.yml: Changesets publish to npm (guarded — only if NPM_TOKEN present).

⸻

📚 Docs
	•	Root README: badges (CI, license), overview, architecture diagram (flow: JWT → Guard → OPA → SpiceDB), quickstart, link to packages, how to run sample and benchmarks.
	•	docs/getting-started.md: quickstart (build, bundle, compose, schema, seed, curls).
	•	docs/architecture.md: request flow, outbox writer flow, bundle contents.
	•	docs/troubleshooting.md: OPA plugin connection, schema loading, outbox backlog, time window caveats.

⸻

✅ Implementation order & self-checks (atomic commits)
	1.	Workspace & root: pnpm, TS/ESLint/Prettier, Changesets, LICENSE, README.
✅ pnpm i → pnpm -r build
	2.	@arye/nestjs-opa-core: decorators, generic module/guard/service, tests.
✅ pnpm -F @arye/nestjs-opa-core build && test green.
	3.	@arye/nestjs-opa-rego: policy, data, bundle CLI, opa test.
✅ pnpm -F @arye/nestjs-opa-rego build-bundle and policy tests green.
	4.	@arye/nestjs-spicedb-writer: entity, subscribers, writer, tests.
✅ tests green.
	5.	Sample smarthome-api: CRUD + actions + seed + compose + OPA plugin image + schema.
✅ Compose up; schema applied; seed OK; e2e assertions (above) pass.
	6.	Bench: generator, k6 scenarios, Makefile, smoke workflow.
✅ make bench-small yields a markdown report.
	7.	Docs & CI: all workflows pass; docs complete.

Definition of Done (must all pass):
	•	pnpm -r build and all unit tests pass; opa test passes.
	•	Example compose boots; e2e assertions pass.
	•	Bench small produces report.
	•	Docs complete & accurate.
	•	No secrets committed; release workflow gated on NPM_TOKEN.

At the end, print:
	•	A succinct summary of what was built.
	•	Final key file tree.
	•	Exact commands to verify locally (copy-paste).
	•	Any manual steps (e.g., spicedb schema write).

Begin now. If a detail is ambiguous, pick a sensible default and document it in README.

⸻

(Optional) Codex Settings → General → Custom instructions

Before each commit:
- Run: pnpm -r build && pnpm -r test && pnpm -F @arye/nestjs-opa-rego test:policy
- For example changes: bring up docker compose, apply schema, run quick e2e smoke; never commit failing builds.
- Keep READMEs/docs consistent with any public API or CLI change.
- Ensure the OPA bundle builds and SpiceDB schema loads without errors.


⸻
