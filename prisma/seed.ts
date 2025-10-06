import { PrismaClient, GameType, TournamentStatus, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jaipalesports.com' },
    update: {},
    create: {
      email: 'admin@jaipalesports.com',
      name: 'Admin User',
      password: hashedPassword,
      age: 25,
      phone: '+91-9876543210',
      isVerified: true,
      role: UserRole.ADMIN,
    },
  })

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'user@jaipalesports.com' },
    update: {},
    create: {
      email: 'user@jaipalesports.com',
      name: 'Test User',
      password: userPassword,
      age: 22,
      phone: '+91-9876543211',
      isVerified: true,
      role: UserRole.USER,
    },
  })

  // Create sample tournaments
  const tournaments = [
    {
      title: 'PUBG Mobile Championship 2024',
      description: 'Join the ultimate PUBG Mobile tournament with massive prize pool. Battle royale at its finest with professional players from across India.',
      game: GameType.PUBG,
      entryFee: 200,
      prizePool: 10000,
      maxPlayers: 100,
      minPlayers: 50,
      startDate: new Date('2024-02-15T18:00:00Z'),
      endDate: new Date('2024-02-15T22:00:00Z'),
      registrationStart: new Date('2024-01-15T00:00:00Z'),
      registrationEnd: new Date('2024-02-14T23:59:59Z'),
      status: TournamentStatus.REGISTRATION_OPEN,
      rules: `
1. Players must be 18+ years old
2. No cheating or use of third-party software
3. Stable internet connection required
4. Respect other players and follow fair play
5. Tournament will be conducted in TPP mode
6. Top 3 players will receive prizes
7. Registration fee is non-refundable
      `.trim(),
      banner: '/api/placeholder/400/200',
    },
    {
      title: 'Free Fire Battle Royale',
      description: 'Fast-paced Free Fire tournament for mobile gamers. Quick matches, intense battles, and great prizes await!',
      game: GameType.FREE_FIRE,
      entryFee: 100,
      prizePool: 5000,
      maxPlayers: 50,
      minPlayers: 25,
      startDate: new Date('2024-02-20T19:00:00Z'),
      endDate: new Date('2024-02-20T21:00:00Z'),
      registrationStart: new Date('2024-01-20T00:00:00Z'),
      registrationEnd: new Date('2024-02-19T23:59:59Z'),
      status: TournamentStatus.REGISTRATION_OPEN,
      rules: `
1. Players must be 18+ years old
2. No cheating or use of third-party software
3. Stable internet connection required
4. Respect other players and follow fair play
5. Tournament will be conducted in Classic mode
6. Top 3 players will receive prizes
7. Registration fee is non-refundable
      `.trim(),
      banner: '/api/placeholder/400/200',
    },
    {
      title: 'BGMI Pro League',
      description: 'Professional BGMI tournament with top players from across India. Show your skills and compete for the championship!',
      game: GameType.BGMI,
      entryFee: 300,
      prizePool: 15000,
      maxPlayers: 80,
      minPlayers: 40,
      startDate: new Date('2024-02-25T17:00:00Z'),
      endDate: new Date('2024-02-25T21:00:00Z'),
      registrationStart: new Date('2024-01-25T00:00:00Z'),
      registrationEnd: new Date('2024-02-24T23:59:59Z'),
      status: TournamentStatus.UPCOMING,
      rules: `
1. Players must be 18+ years old
2. No cheating or use of third-party software
3. Stable internet connection required
4. Respect other players and follow fair play
5. Tournament will be conducted in TPP mode
6. Top 5 players will receive prizes
7. Registration fee is non-refundable
      `.trim(),
      banner: '/api/placeholder/400/200',
    },
    {
      title: 'Valorant Championship',
      description: 'Tactical FPS tournament for Valorant players. Team-based gameplay with strategic depth and exciting matches.',
      game: GameType.VALORANT,
      entryFee: 250,
      prizePool: 12000,
      maxPlayers: 64,
      minPlayers: 32,
      startDate: new Date('2024-03-01T18:00:00Z'),
      endDate: new Date('2024-03-01T22:00:00Z'),
      registrationStart: new Date('2024-02-01T00:00:00Z'),
      registrationEnd: new Date('2024-02-29T23:59:59Z'),
      status: TournamentStatus.UPCOMING,
      rules: `
1. Players must be 18+ years old
2. No cheating or use of third-party software
3. Stable internet connection required
4. Respect other players and follow fair play
5. Tournament will be conducted in Unrated mode
6. Top 3 teams will receive prizes
7. Registration fee is non-refundable
      `.trim(),
      banner: '/api/placeholder/400/200',
    },
  ]

  for (const tournament of tournaments) {
    await prisma.tournament.upsert({
      where: { id: tournament.title },
      update: {},
      create: tournament,
    })
  }

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: testUser.id,
        title: 'Welcome to Jaipal Esports!',
        message: 'Thank you for joining our platform. Start exploring tournaments and compete for amazing prizes!',
        type: 'SUCCESS',
      },
      {
        userId: testUser.id,
        title: 'New Tournament Available',
        message: 'PUBG Mobile Championship 2024 is now open for registration. Don\'t miss out!',
        type: 'INFO',
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: admin@jaipalesports.com / admin123')
  console.log('👤 Test user: user@jaipalesports.com / user123')
  console.log('🏆 Created 4 sample tournaments')
  console.log('📧 Created sample notifications')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
