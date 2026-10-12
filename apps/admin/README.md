# Talent: institution portal

The tenant dashboard for institutions (schools and colleges) using Bluespark: students, career assessments, reports, resources and organisation settings. It's a Next.js 16 App Router app that shares the Bluespark design tokens with `apps/website`.

```bash
pnpm --filter talent dev          # http://localhost:3001 → /tenant
pnpm --filter talent lint
pnpm --filter talent check-types
pnpm --filter talent build
```

## Demo mode

There is no authentication backend or tenant API in this repository yet, so the portal currently runs on an **in-memory development mock** (`src/lib/tenant/mock`):

- Demo mode is on automatically under `next dev`. To use it in a production build, set `TENANT_DEMO_MODE=true`. This is intended for previews only.
- A banner on every page marks the data as sample data. Its "Viewing as" switcher changes between seeded users across two schools and three roles, so you can check permissions and tenant isolation.
- Edits are kept in server memory and reset when the server restarts.

With demo mode off, every `/tenant` route redirects to sign-in until a real session exists.

| Variable           | Default                     | Purpose                                   |
| ------------------ | --------------------------- | ----------------------------------------- |
| `TENANT_DEMO_MODE` | off (on under `next dev`)   | Serve the development mock in production. |
| `WEBSITE_URL`      | `http://localhost:3000`     | The marketing and sign-in site.           |
| `SIGN_IN_URL`      | `${WEBSITE_URL}/signin`     | Where visitors without a session are sent. |

## How data flows

```
page / server action / route handler
  → src/lib/tenant/data.ts        DAL: resolves the session, scopes every read to session.tenantId
  → src/lib/tenant/repository.ts  TenantRepository interface (tenant id is always an argument)
  → src/lib/tenant/mock/*         current implementation (development only)
```

- **Tenant isolation:** the tenant id and role come from the server-side session, never from URLs, cookies or form input. A record from another tenant resolves to "not found".
- **Authorisation:** server actions (`src/lib/tenant/actions.ts`) and the CSV export routes re-check the session, role (`src/lib/tenant/permissions.ts`) and input validation (`src/validation/tenantValidation.ts`) on every call. Hiding buttons in the UI is a convenience only.

## Connecting the real backend

1. **Authentication:** implement `getTenantSession()` in `src/lib/tenant/session.ts` to verify the real session and load the user.
2. **Data:** add a `TenantRepository` implementation backed by the API or database and return it from `getTenantRepository()`.
3. **Types:** align `src/lib/tenant/types.ts` with the real schema.

Nothing else needs to change: pages and components only consume the DAL.
