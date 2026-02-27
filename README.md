# Hyper-Local Charity Comms & Impact Dashboard

A warm, lightweight internal dashboard for neurodivergent-family support charities. It focuses on continuity, evidence gathering, and simple reporting.

## Features

- Family Referral Tracker (anonymised records only)
- Monthly Engagement Metrics with CSV export
- Awareness Calendar with recurring annual events
- Asset Library with upload/search/filter/download
- Funding Evidence report exports (PDF + CSV)
- Privacy notice and retention settings (default 3 years)
- Secure cookie-based authentication with Admin/User roles
- Soft delete on records

## Tech Stack

- Next.js 14 + TypeScript
- Prisma ORM
- PostgreSQL (Vercel compatible)
- TailwindCSS
- Recharts
- React Hook Form + Zod-ready structure

## Project Structure

- `app/`
- `components/`
- `prisma/`
- `lib/`
- `types/`
- `utils/`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Run prisma generate and migrate:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Seed starter data:
   ```bash
   npm run prisma:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

Default seeded admin login:

- Email: `admin@charity.local`
- Password: `admin12345`

## Vercel Deployment

1. Push this repo to GitHub.
2. In Vercel, create a new project and import the repo.
3. In **Project → Settings → Environment Variables**, add:
   - `DATABASE_URL`
     - Get this from your Postgres provider connection string.
     - Vercel Postgres path: **Storage → Postgres → .env.local** and copy `POSTGRES_PRISMA_URL`/`DATABASE_URL`.
   - `NEXTAUTH_SECRET`
     - Generate locally with:
       ```bash
       openssl rand -base64 32
       ```
     - Paste the generated value.
   - `NEXTAUTH_URL (kept for deployment compatibility)`
     - Set to your live app URL, for example: `https://campaignapp.vercel.app`.
4. In **Project → Settings → Build & Development Settings**:
   - Install Command: `npm install`
   - Build Command: `npm run build`
5. Deploy.
6. Run production migrations (after first deploy and each schema change):
   ```bash
   npx prisma migrate deploy
   ```
7. Optional one-time sample data seed:
   ```bash
   npm run prisma:seed
   ```

### Optional: Upstash Redis / KV
You do **not** need Upstash for the current app features. The dashboard stores data in PostgreSQL via Prisma.

If you want to keep Upstash configured in Vercel for future features, add these env vars in **Project → Settings → Environment Variables**:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`
- `REDIS_URL`

Important: if tokens were pasted in chat or committed anywhere, rotate them in Upstash now:
1. Upstash Console → your database → **REST Tokens** → regenerate tokens.
2. Upstash Console → rotate Redis password/connection string.
3. Update Vercel env vars with the new values.


### Which env vars are actually needed?
For this app, the required production env vars are:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL (kept for deployment compatibility)`

These variables from your other project are **not used by this codebase** and will not fix NextAuth build issues by themselves:
- `QSTASH_NEXT_SIGNING_KEY`
- `QSTASH_CURRENT_SIGNING_KEY`
- `QSTASH_TOKEN`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_REDIS_REST_URL`
- `REDIS_URL`

If you already added those, you can keep them, but they are optional/unused here.

If auth build errors continue:
1. Confirm `NEXTAUTH_SECRET` exists in Vercel for Production.
2. Confirm `NEXTAUTH_URL (kept for deployment compatibility)` exactly matches deployed domain (including `https://`).
3. Confirm `DATABASE_URL` is a valid Neon pooled connection string and the database is reachable.


### If Vercel still reports /api/auth/[...nextauth]
If Vercel keeps showing an old NextAuth build error, it is usually deploying an older commit or stale build cache.

Do this once:
1. Confirm the deployment commit includes `app/api/auth/[...nextauth]/route.ts` as a compatibility stub (no `next-auth` import).
2. In Vercel Deployments, click **Redeploy** and enable **Use existing Build Cache: Off**.
3. Ensure branch + commit match latest main head.

### Notes for known build issues
- The PDF export no longer uses `pdfkit`, preventing `fontkit/iconv-lite` deployment failures.
- API routes are forced dynamic to avoid static build data-collection failures on dynamic API endpoints.

## Data Protection Notes

- System intentionally stores no family names, diagnoses, or medical details.
- Notes fields are optional and anonymised.
- Soft delete is used for continuity and audit safety.
- Retention policy defaults to 3 years and is configurable in app.

## Using for Funding Bids

Use **Reports** page to generate:

- 12-month impact summary PDF narrative
- Referral source CSV breakdown
- Monthly metrics CSV

These outputs can be attached directly to funding applications.
