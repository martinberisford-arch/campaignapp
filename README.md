# Charity Impact Dashboard (Rebuilt Clean)

This project has been rebuilt from scratch to remove the repeated auth/build issues and keep deployment simple.

## Stack
- Next.js 14
- TypeScript
- Prisma + PostgreSQL
- Tailwind
- Recharts

## Authentication
- Cookie-based session only (`charity_session`)
- No NextAuth route or middleware dependency
- Login page: `/login`

## Setup
1. `cp .env.example .env`
2. `npm install`
3. `npm run prisma:generate`
4. `npm run prisma:migrate`
5. `npm run prisma:seed`
6. `npm run dev`

Default login:
- `admin@charity.local`
- `admin12345`

## Required env vars
- `DATABASE_URL`
- `SESSION_SECRET`

## Vercel deploy
- Build command: `npm run build`
- Install command: `npm install`
- Add required env vars in Project Settings
- Run `npx prisma migrate deploy` for production database
