# BharatGig - India's Premier Freelancing Platform

A comprehensive freelancing marketplace built with Next.js, Supabase, and modern web technologies.

## Features

### Core Features
- ✅ User Authentication (Email/Password + Google OAuth)
- ✅ Dual User Roles (Freelancers & Clients)
- ✅ Job Posting & Browsing
- ✅ Proposal/Bidding System
- ✅ Real-time Messaging
- ✅ Secure Payments with Razorpay
- ✅ Escrow System
- ✅ Reviews & Ratings
- ✅ Dispute Resolution
- ✅ Subscription Plans (₹99/month, ₹999/year)

### Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Payments**: Razorpay
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Razorpay account
- Resend account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd bharatgig
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Resend
RESEND_API_KEY=your_resend_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Supabase Database**

Run the migrations in your Supabase SQL editor:
```bash
# Run these files in order:
1. supabase/migrations/20260209_initial_schema.sql
2. supabase/migrations/20260209_rls_policies.sql
3. supabase/seed.sql
```

5. **Configure Supabase Auth**

In your Supabase dashboard:
- Go to Authentication → Providers
- Enable Email provider
- Enable Google OAuth (add your Google OAuth credentials)
- Add `http://localhost:3000/auth/callback` to redirect URLs

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bharatgig/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── dashboard/           # Dashboard pages
│   ├── jobs/                # Job listing and details
│   ├── proposals/           # Proposal management
│   ├── messages/            # Messaging system
│   ├── payments/            # Payment pages
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # UI components (Button, Card, etc.)
│   ├── dashboard/           # Dashboard-specific components
│   ├── jobs/                # Job-related components
│   └── ...
├── lib/                     # Utility functions
│   ├── supabase/            # Supabase clients
│   ├── razorpay/            # Razorpay integration
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript type definitions
└── supabase/               # Database migrations and seeds
```

## Database Schema

The platform uses a comprehensive PostgreSQL schema with:
- User management (users, freelancer_profiles, client_profiles)
- Job system (jobs, proposals, projects)
- Messaging (conversations, messages)
- Payments (transactions, escrow_accounts, subscriptions)
- Reviews and disputes
- Notifications

See `supabase/migrations/` for complete schema.

## Subscription Plans

- **Free**: Limited features
- **Monthly**: ₹99/month - Full access
- **Yearly**: ₹999/year - Full access (2 months free)

## Development

### Build for production
```bash
npm run build
```

### Run production build
```bash
npm start
```

### Lint code
```bash
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to add all environment variables from `.env.local` to your Vercel project settings.

## Features Roadmap

- [ ] AI-powered job matching
- [ ] Video calls integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Time tracking system
- [ ] Contract management
- [ ] Invoice generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@bharatgig.com or join our Slack channel.
