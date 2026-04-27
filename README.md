# 🎮 Nexus Arena - Full-Stack eSports Tournament Platform

Nexus Arena is a production-grade, end-to-end tournament orchestration platform designed for the competitive gaming ecosystem. It automates the complex lifecycle of eSports events, from secure registration and payment to real-time bracket generation and prize distribution.

## 🚀 Key Features

### 🏆 Tournament Management
- **Dynamic Brackets**: Automated single-elimination bracket generation with real-time visualization.
- **Match Control Center**: Admin interface for managing match states, declaring winners, and distributing lobby credentials (Room ID/Pass).
- **Lobby Automation**: Secure distribution of private lobby details to confirmed participants.

### 💰 Financial Ecosystem
- **Secure Payments**: Integrated Razorpay gateway with cryptographically signed verification.
- **Player Wallet**: Real-time balance tracking for winnings and deposits.
- **Withdrawal Queue**: Automated payout request system with support for UPI and Bank Transfers.

### 🛡️ Trust & Safety
- **KYC Verification**: Built-in identity verification system for tournament eligibility and tax compliance.
- **Role-Based Access (RBAC)**: Fine-grained permissions for Admins, Super Admins, and Players.
- **Fair Play Enforcement**: Admin-led match dispute resolution and player verification.

### 📊 Player Engagement
- **Career Statistics**: Detailed player profiles featuring Win Rate, Total Earnings, and Performance Trends.
- **Global Leaderboard**: Competitive ranking system based on lifetime prize earnings.
- **Support Hub**: Integrated FAQ and real-time support channels.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Shadcn UI, Lucide Icons
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL (Supabase/Neon) with Prisma ORM
- **Auth**: NextAuth.js (Google & Credentials)
- **Payments**: Razorpay Node SDK
- **Deployment**: Vercel / Docker

## 🚦 Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites
- Node.js 18.x or later
- PostgreSQL database
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/kabirjaipal/nexusarena.git
cd nexusarena

# Install dependencies
npm install
```

### 3. Environment Setup
Copy the example environment file and fill in your credentials:
```bash
cp .env.example .env
```
*See the [Environment Variables](#-environment-variables) section for more details.*

### 4. Database Initialization
```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Seed the database with initial data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🔑 Environment Variables

The application requires several environment variables to function correctly. You can find these in `.env.example`.

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret used to hash tokens, sign/encrypt cookies |
| `NEXTAUTH_URL` | The base URL of your site (e.g., `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |
| `SMTP_USERNAME` | SMTP server username for emails |
| `SMTP_PASSWORD` | SMTP server password/app password |
| `EMAIL_FROM_ADDRESS` | Email address to send from |
| `NEXT_PUBLIC_APP_URL` | The public URL of the application |
| `NEXT_PUBLIC_APP_NAME` | The display name of the application |

---

*Built with ❤️ by [Kabir Jaipal](https://github.com/kabirjaipal)*
