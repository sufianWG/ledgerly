# Ledgerly (Digital Life Lessons)

A platform where people share the lessons life has taught them, and read what life has taught everyone else. Free members can browse and save lessons; Premium members (one-time ৳1500 payment) unlock deeper, member-only stories.

- Live Site: https://ledgerly-sand-seven.vercel.app
- Client Repo: https://github.com/sufianWG/ledgerly
- Server Repo: https://github.com/sufianWG/ledgerly-server

## Features

- Email/password and Google login (better-auth)
- Browse, search, filter and sort public lessons
- Like, save and report a lesson
- Free vs Premium (Stripe checkout, lifetime access, no webhook — verified on the success page)
- Role-based dashboards
  - User: my lessons, favorites, profile
  - Admin: platform stats, manage users, manage lessons, reported lessons, admin profile
- Animated hero slider and a few subtle motion.dev animations on the home page

## Tech Stack

- Next.js (App Router) + Tailwind CSS + HeroUI
- better-auth (auth, JWT)
- Stripe (checkout)
- Talks to a separate Express + MongoDB API (see [ledgerly-server](https://github.com/sufianWG/ledgerly-server))

## Environment Variables

```
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
MONGODB_URI=
MONGO_DB=
NEXT_SITE_URL=
NEXT_PUBLIC_SERVER_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
IMGBB_API=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRODUCT_PRICE_ID=
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
