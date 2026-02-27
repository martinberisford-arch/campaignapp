# Hyper-Local Charity Comms & Impact Dashboard

A warm, lightweight internal dashboard for neurodivergent-family support charities. It focuses on continuity, evidence gathering, and simple reporting.

## Features

- Family Referral Tracker (anonymised records only)
- Monthly Engagement Metrics with CSV export
- Awareness Calendar with recurring annual events
- Asset Library with upload/search/filter/download
- Funding Evidence report exports (PDF + CSV)
- Privacy notice and retention settings (default 3 years)
- Secure authentication with Admin/User roles
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

1. Push to Git repository.
2. Create Vercel project.
3. Add environment variables from `.env.example`.
4. Attach PostgreSQL database and set `DATABASE_URL`.
5. Set build command `npm run build`.
6. Deploy.


## Vercel Deployment Troubleshooting

If you saw deployment errors previously, do the following:

1. In Vercel **Project Settings → Environment Variables**, set:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production URL, e.g. `https://your-app.vercel.app`)
2. In Vercel **Build & Development Settings**, keep build command as:
   - `npm run build`
3. Redeploy. This codebase removes `pdfkit` to avoid the `fontkit/iconv-lite` bundling error.
4. If Prisma complains at runtime, run migrations from your CI/local machine and redeploy:
   - `npx prisma migrate deploy`
5. Optional post-deploy seed (for first-time demo data only):
   - `npm run prisma:seed`

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
