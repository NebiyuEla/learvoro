# Claremint

Claremint is a paid-learning platform built with Vinext/React, TypeScript, Cloudflare D1 and R2, Drizzle, and Stripe PaymentIntents.

## Local development

1. Copy `.env.example` to `.env.local` and add test-only provider credentials.
2. Run `npm install` and `npm run dev`.
3. Generate schema migrations after model changes with `npm run db:generate`.
4. Apply `db/seed.sql` only to a local development database.

Authentication in the hosted build uses the platform-owned sign-in flow. The original brief also requests standalone email/password and Google authentication; configure a production identity provider before using Claremint outside Sites.

## Stripe test flow

Set Stripe test-mode keys and forward Stripe CLI events to `/api/webhooks/stripe`. The checkout endpoint reads the published course price from D1, creates or recovers one pending order, and uses its order ID as the Stripe idempotency key. The verified webhook validates order ownership, amount and currency before granting an entitlement. Use only the test payment methods documented by Stripe; no card number is included in this application.

## Production setup

- Configure Stripe, email and video provider secrets through the hosting control plane, never in source.
- Configure the Stripe webhook signing secret and subscribe to PaymentIntent success/failure, refund and dispute events.
- Upload paid resources to the private R2 binding and issue them only through entitlement-checked server routes.
- Configure a private/signed video provider and never persist public playback URLs.
- Set `ADMIN_EMAILS`, then promote authorized records to `admin` through a controlled database operation.
- Replace the temporary text wordmark only after the supplied official logo asset is available.

## Security model

Price and enrollment decisions are server-side. Entitlements are per user and course. Stripe webhook signatures and event IDs prevent forged or duplicate fulfillment. D1 uniqueness constraints prevent duplicate entitlements, progress rows, reviews and wishlist entries. No raw card data, CVC, passwords, tokens or permanent paid-resource URLs are stored.

## Validation

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` before deployment.
