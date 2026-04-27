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

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/nexus-arena.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file with:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`

4. **Initialize Database**:
   ```bash
   npx prisma db push
   npx prisma generate
   npx prisma db seed
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

---

*Built with ❤️ by [Your Name]*
