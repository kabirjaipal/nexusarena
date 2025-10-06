-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('PUBG', 'FREE_FIRE', 'BGMI', 'VALORANT', 'CS2');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('UPCOMING', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "m_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "password" TEXT,
    "age" INTEGER,
    "phone" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "m_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_user_kyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "idType" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "idDocument" TEXT NOT NULL,
    "addressProof" TEXT NOT NULL,
    "status" "KYCStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "m_user_kyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_tournaments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "game" "GameType" NOT NULL,
    "entryFee" DECIMAL(10,2) NOT NULL,
    "prizePool" DECIMAL(10,2) NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "minPlayers" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "registrationStart" TIMESTAMP(3) NOT NULL,
    "registrationEnd" TIMESTAMP(3) NOT NULL,
    "status" "TournamentStatus" NOT NULL DEFAULT 'UPCOMING',
    "rules" TEXT NOT NULL,
    "banner" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_registrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentId" TEXT,

    CONSTRAINT "t_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_matches" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "player1Id" TEXT,
    "player2Id" TEXT,
    "winnerId" TEXT,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayId" TEXT,
    "razorpayOrderId" TEXT,
    "method" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "p_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p_payouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayId" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "p_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_users_email_key" ON "m_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "m_accounts_provider_providerAccountId_key" ON "m_accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "m_sessions_sessionToken_key" ON "m_sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "m_user_kyc_userId_key" ON "m_user_kyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "t_registrations_paymentId_key" ON "t_registrations"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "t_registrations_userId_tournamentId_key" ON "t_registrations"("userId", "tournamentId");

-- AddForeignKey
ALTER TABLE "m_accounts" ADD CONSTRAINT "m_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_sessions" ADD CONSTRAINT "m_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_user_kyc" ADD CONSTRAINT "m_user_kyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_notifications" ADD CONSTRAINT "m_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_registrations" ADD CONSTRAINT "t_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_registrations" ADD CONSTRAINT "t_registrations_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "t_tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_registrations" ADD CONSTRAINT "t_registrations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "p_payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_matches" ADD CONSTRAINT "t_matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "t_tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_payments" ADD CONSTRAINT "p_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p_payouts" ADD CONSTRAINT "p_payouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
