import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifySeed() {
  console.log('🔍 Verifying seeded data...\n')

  // Count all records
  const userCount = await prisma.user.count()
  const tournamentCount = await prisma.tournament.count()
  const registrationCount = await prisma.registration.count()
  const paymentCount = await prisma.payment.count()
  const payoutCount = await prisma.payout.count()
  const matchCount = await prisma.match.count()
  const notificationCount = await prisma.notification.count()
  const kycCount = await prisma.userKYC.count()

  console.log('📊 Database Statistics:')
  console.log(`👥 Users: ${userCount}`)
  console.log(`🏆 Tournaments: ${tournamentCount}`)
  console.log(`📝 Registrations: ${registrationCount}`)
  console.log(`💳 Payments: ${paymentCount}`)
  console.log(`💰 Payouts: ${payoutCount}`)
  console.log(`🎮 Matches: ${matchCount}`)
  console.log(`📧 Notifications: ${notificationCount}`)
  console.log(`📋 KYC Records: ${kycCount}`)

  // Show user roles
  const userRoles = await prisma.user.groupBy({
    by: ['role'],
    _count: { role: true }
  })

  console.log('\n👥 User Roles:')
  userRoles.forEach(role => {
    console.log(`  ${role.role}: ${role._count.role}`)
  })

  // Show tournament games
  const tournamentGames = await prisma.tournament.groupBy({
    by: ['game'],
    _count: { game: true }
  })

  console.log('\n🏆 Tournament Games:')
  tournamentGames.forEach(game => {
    console.log(`  ${game.game}: ${game._count.game}`)
  })

  // Show tournament statuses
  const tournamentStatuses = await prisma.tournament.groupBy({
    by: ['status'],
    _count: { status: true }
  })

  console.log('\n📊 Tournament Statuses:')
  tournamentStatuses.forEach(status => {
    console.log(`  ${status.status}: ${status._count.status}`)
  })

  // Show payment statuses
  const paymentStatuses = await prisma.payment.groupBy({
    by: ['status'],
    _count: { status: true }
  })

  console.log('\n💳 Payment Statuses:')
  paymentStatuses.forEach(status => {
    console.log(`  ${status.status}: ${status._count.status}`)
  })

  // Show KYC statuses
  const kycStatuses = await prisma.userKYC.groupBy({
    by: ['status'],
    _count: { status: true }
  })

  console.log('\n📋 KYC Statuses:')
  kycStatuses.forEach(status => {
    console.log(`  ${status.status}: ${status._count.status}`)
  })

  // Show some sample data
  console.log('\n📋 Sample Users:')
  const sampleUsers = await prisma.user.findMany({
    take: 5,
    select: {
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true
    }
  })

  sampleUsers.forEach(user => {
    console.log(`  ${user.name} (${user.email}) - ${user.role} - ${user.isVerified ? 'Verified' : 'Unverified'}`)
  })

  console.log('\n🏆 Sample Tournaments:')
  const sampleTournaments = await prisma.tournament.findMany({
    take: 5,
    select: {
      title: true,
      game: true,
      entryFee: true,
      prizePool: true,
      status: true,
      maxPlayers: true
    }
  })

  sampleTournaments.forEach(tournament => {
    console.log(`  ${tournament.title} (${tournament.game}) - ₹${tournament.entryFee} entry, ₹${tournament.prizePool} prize - ${tournament.status}`)
  })

  console.log('\n✅ Seed verification complete!')
}

verifySeed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error verifying seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
