# DesignOS — AI-native product design studio

DesignOS is an AI-native fintech checkout design studio. It turns a checkout brief into a structured design direction, then provides an interactive demo checkout to explore payment-method selection, coupon application, successful completion, and payment-failure recovery. It keeps hypotheses visible and clearly labels the prototype as a simulation.

## What's included
- Responsive React/Next.js interface with five result views.
- Server-side `/api/generate` endpoint.
- Demo mode works without credentials so you can explore the flow immediately.
- Optional OpenAI-compatible generation via a server-side `OPENAI_API_KEY`.
- Copy JSON and download a `designos-plan.json` export.
- Interactive checkout prototype with UPI, card, and net banking options.
- Demo coupon (`WELCOME10`), simulated success, and simulated payment-failure state.
- No real payment credentials are collected and no money is moved.
- Input validation and user-friendly provider errors.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000. Without an API key, it runs in demo mode. To enable live model generation, set `OPENAI_API_KEY` in `.env.local` and optionally set `OPENAI_MODEL` (defaults to `gpt-4.1-mini`). Restart the dev server after changing environment variables.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel
1. Create a new Vercel project and import this repository, or run `npx vercel` from the project directory.
2. Add `OPENAI_API_KEY` and (optionally) `OPENAI_MODEL` in the project environment variables. Keep the API key server-side; do not prefix it with `NEXT_PUBLIC_`.
3. Deploy. The app can also be previewed without a key in demo mode.

See the official [Next.js environment variable guide](https://nextjs.org/docs/pages/guides/environment-variables) and [Vercel deployment environments](https://vercel.com/docs/deployments/environments).

## Current prototype boundaries
This is an MVP, not yet a complete design-to-production platform. It does not currently process real payments, write native Figma files, run automated browser-based visual tests, save projects to a database, or support user accounts. Those are the next production milestones. The demo mode is clearly labeled; only a configured model key invokes live AI generation.

## Security notes
- Never commit `.env.local` or API keys.
- The API key is read only on the server by the route handler.
- Avoid putting confidential customer data into prompts until access controls, retention rules, and a privacy review are in place.

## Smoke test
Start the app in one terminal with `npm run dev`, then run `npm run smoke-test` in another. The test checks the API's invalid-input response and validates the shape of a generated checkout plan. To test a deployed preview, set `DESIGNOS_BASE_URL` to that URL before running the command.

## Verification notes for this source package
- TypeScript/TSX syntax transpilation was checked with the available TypeScript compiler.
- The generation route was exercised with a local test harness: short brief returned HTTP 400; valid brief returned HTTP 200 in demo mode with checkout-specific output.
- A full `npm install` and Next.js production build could not be completed in the current environment because npm registry DNS requests failed (`EAI_AGAIN`). Run `npm install` and `npm run build` in a network-enabled development environment before deployment.


## Workspace enhancements (v0.3)

- Click the profile name/avatar to edit the local display name and optional email.
- Open **All projects** to create, reopen, and delete saved project briefs.
- Use **Save as project** beneath a generated design direction to save the current brief.
- Profile and project data are stored in browser localStorage for this MVP; there is no authentication, cloud sync, or shared multi-user database yet.
