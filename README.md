# Learvoro

Learvoro is a paid-learning platform built with Next.js, TypeScript, PostgreSQL, secure cookie sessions, Google OAuth, and Stripe PaymentIntents.

## Local development

1. Copy `.env.example` to `.env.local`, set `DATABASE_URL` to PostgreSQL, and add test-only provider credentials.
2. Run `npm install` and `npm run dev`.
3. Required PostgreSQL tables are created on the first database-backed request.

Email/password authentication stores only bcrypt password hashes. Google sign-in requires a Google OAuth web client with `/api/auth/google/callback` configured as an authorized redirect URI.

## Stripe test flow

Set Stripe test-mode keys and forward Stripe CLI events to `/api/webhooks/stripe`. The checkout endpoint reads the published course price from PostgreSQL, creates or recovers one pending order, and uses its order ID as the Stripe idempotency key. The verified webhook validates order ownership, amount and currency before granting an entitlement. Use only the test payment methods documented by Stripe; no card number is included in this application.

## Production setup

- Render does not require a Blueprint. Create a PostgreSQL database manually in the Render dashboard, copy its **Internal Database URL** into the web service's `DATABASE_URL`, and use `npm start` as the start command. The start command applies the database schema before launching the site.
- For the existing Render web service, use `npm ci && npm run build` as the build command and `npm start` as the start command.
- Configure Stripe, email and video provider secrets through the hosting control plane, never in source.
- Configure the Stripe webhook signing secret and subscribe to PaymentIntent success/failure, refund and dispute events.
- Store paid resources in private object storage and issue them only through entitlement-checked server routes.
- Configure a private/signed video provider and never persist public playback URLs.
- Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` for `/adminplatform`.
- Keep the supplied Learvoro logo asset unchanged; layout cropping only removes its surrounding white space.

## Security model

Price and enrollment decisions are server-side. Entitlements are per user and course. Stripe webhook signatures and event IDs prevent forged or duplicate fulfillment. PostgreSQL uniqueness constraints prevent duplicate entitlements and progress rows. No raw card data, CVC, or OAuth tokens are stored; passwords are stored only as bcrypt hashes.

## Validation

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` before deployment.
