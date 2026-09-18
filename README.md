# Ballistiq - Daily Sports Trivia SaaS

A sports trivia platform built with Next.js, Supabase, and Stripe. Features daily challenges, multiplayer games, and subscription management.

## Tech Stack (100% Free Tier)

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Stripe
- **Hosting**: Vercel
- **Cost**: $0/month (only domain registration needed)

## Features

- ✅ Daily trivia challenges (4 game types)
- ✅ User authentication (Supabase Auth)
- ✅ Free & Pro subscription tiers
- ✅ Real-time multiplayer
- ✅ Leaderboards
- ✅ Progress tracking
- ✅ Dark mode
- ✅ Responsive design

## Setup Instructions

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

### 2. Supabase Setup (Free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > API to get your:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. Run the database schema:
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `supabase-schema.sql`
   - Run the SQL

5. Enable Email Auth:
   - Go to Authentication > Providers
   - Enable Email provider

### 3. Stripe Setup (Free)

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from Developers > API keys:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

3. Create a product:
   - Go to Products > Add Product
   - Name: "Ballistiq Pro"
   - Price: $4.99/month (recurring)
   - Copy the Price ID to `STRIPE_PRO_PRICE_ID`

4. Set up webhook (after deploying):
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add all environment variables from `.env.local`
5. Deploy!

### 7. Connect Your Domain

1. In Vercel, go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed

## Project Structure

```
ballistiq/
├── app/
│   ├── games/
│   │   ├── pecking-order/    # Sample game implementation
│   │   └── page.tsx           # Games list
│   ├── pricing/               # Subscription plans
│   ├── auth/                  # Login/signup pages
│   └── api/                   # API routes & webhooks
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── header.tsx             # Navigation
│   └── game-card.tsx          # Game display card
├── lib/
│   ├── supabase/              # Supabase clients
│   └── utils.ts               # Utility functions
└── supabase-schema.sql        # Database schema
```

## Game Implementation

Currently includes one complete game: **Pecking Order**

To add more games:
1. Create a new page in `app/games/[game-slug]/`
2. Add game logic with scoring
3. Save attempts to `game_attempts` table
4. Add card to games list

## Database Schema

- `profiles` - User accounts (extends Supabase auth)
- `game_types` - Available games
- `daily_challenges` - Daily puzzles
- `game_attempts` - User game history
- `leaderboard_entries` - Scores & rankings
- `multiplayer_rooms` - Real-time game rooms
- `room_participants` - Players in rooms

## Free Tier Limits

- **Vercel**: 100GB bandwidth, unlimited deployments
- **Supabase**: 500MB database, 2GB file storage, 50,000 monthly active users
- **Stripe**: No monthly fee, 2.9% + $0.30 per transaction

## Next Steps

1. ✅ Set up Supabase & Stripe accounts
2. ✅ Run database migrations
3. 🔲 Implement auth pages (login/signup)
4. 🔲 Add Stripe checkout flow
5. 🔲 Implement remaining games
6. 🔲 Add multiplayer functionality
7. 🔲 Create admin panel for daily challenges
8. 🔲 Add leaderboard page
9. 🔲 Set up email notifications
10. 🔲 Add PWA capabilities

## Support

For issues or questions, create an issue on GitHub.

## License

MIT
