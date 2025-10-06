import { PrismaClient, GameType, TournamentStatus, UserRole, KYCStatus, NotificationType, RegistrationStatus, PaymentStatus, PayoutStatus, MatchStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Sample data generators
const indianNames = [
  'Arjun Sharma', 'Priya Patel', 'Rahul Singh', 'Sneha Gupta', 'Vikram Kumar', 'Ananya Reddy',
  'Karan Mehta', 'Isha Agarwal', 'Rohan Joshi', 'Kavya Nair', 'Aditya Iyer', 'Shreya Das',
  'Ravi Verma', 'Pooja Shah', 'Suresh Tiwari', 'Meera Jain', 'Amit Khanna', 'Divya Rao',
  'Rajesh Malhotra', 'Neha Chopra', 'Vishal Bhatia', 'Ritu Saxena', 'Gaurav Agarwal', 'Sonia Kapoor'
]

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana'
]

const indianStates = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat',
  'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Andhra Pradesh', 'Bihar', 'Punjab',
  'Haryana', 'Kerala', 'Odisha', 'Assam', 'Jharkhand', 'Chhattisgarh', 'Himachal Pradesh'
]

const phoneNumbers = [
  '+91-9876543210', '+91-9876543211', '+91-9876543212', '+91-9876543213', '+91-9876543214',
  '+91-9876543215', '+91-9876543216', '+91-9876543217', '+91-9876543218', '+91-9876543219',
  '+91-9876543220', '+91-9876543221', '+91-9876543222', '+91-9876543223', '+91-9876543224',
  '+91-9876543225', '+91-9876543226', '+91-9876543227', '+91-9876543228', '+91-9876543229'
]

const tournamentTitles = [
  'PUBG Mobile Championship 2024', 'Free Fire Battle Royale', 'BGMI Pro League', 'Valorant Championship',
  'CS2 Counter-Strike Masters', 'PUBG Mobile Weekly', 'Free Fire Squad Wars', 'BGMI Weekend Warriors',
  'Valorant Ranked Rush', 'CS2 Tactical Masters', 'PUBG Mobile Monthly', 'Free Fire Solo Showdown',
  'BGMI Team Tournament', 'Valorant Premier League', 'CS2 Global Championship'
]

const tournamentDescriptions = [
  'Join the ultimate tournament with massive prize pool. Battle royale at its finest with professional players from across India.',
  'Fast-paced tournament for mobile gamers. Quick matches, intense battles, and great prizes await!',
  'Professional tournament with top players from across India. Show your skills and compete for the championship!',
  'Tactical FPS tournament for players. Team-based gameplay with strategic depth and exciting matches.',
  'Counter-Strike tournament featuring the best players. Strategic gameplay and intense competition.',
  'Weekly tournament series for PUBG Mobile enthusiasts. Regular competitions with consistent prizes.',
  'Squad-based Free Fire tournament. Team up with friends and dominate the battlefield.',
  'Weekend tournament for BGMI players. Perfect for casual and competitive gamers.',
  'Ranked-based Valorant tournament. Climb the ranks and prove your skills.',
  'Tactical Counter-Strike tournament. Strategy and skill combined for ultimate competition.'
]

const notificationTitles = [
  'Welcome to Jaipal Esports!', 'New Tournament Available', 'Registration Confirmed', 'Payment Successful',
  'Tournament Starting Soon', 'You Won!', 'KYC Approved', 'Tournament Cancelled', 'Prize Money Credited',
  'New Season Started', 'Maintenance Notice', 'Special Offer Available', 'Leaderboard Updated',
  'Match Schedule Released', 'Registration Deadline Approaching'
]

const notificationMessages = [
  'Thank you for joining our platform. Start exploring tournaments and compete for amazing prizes!',
  'A new tournament is now open for registration. Don\'t miss out on this exciting opportunity!',
  'Your tournament registration has been confirmed. Get ready to compete!',
  'Your payment has been processed successfully. You are now registered for the tournament.',
  'Your tournament is starting in 30 minutes. Please join the lobby now.',
  'Congratulations! You have won the tournament and earned prize money.',
  'Your KYC verification has been approved. You can now participate in all tournaments.',
  'Unfortunately, the tournament has been cancelled. Your registration fee will be refunded.',
  'Your prize money has been credited to your account. Check your wallet for details.',
  'A new season has started with exciting tournaments and rewards.',
  'Scheduled maintenance will occur tonight from 2 AM to 4 AM IST.',
  'Special discount available on tournament entry fees for the next 24 hours.',
  'The leaderboard has been updated with the latest tournament results.',
  'Match schedules for your registered tournaments have been released.',
  'Registration for your favorite tournament closes in 2 hours. Register now!'
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateAadharNumber(): string {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString()
}

function generatePANNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  let pan = ''
  for (let i = 0; i < 5; i++) {
    pan += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  for (let i = 0; i < 4; i++) {
    pan += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  pan += letters.charAt(Math.floor(Math.random() * letters.length))
  return pan
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

async function main() {
  console.log('🌱 Starting comprehensive database seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.payout.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.match.deleteMany()
  await prisma.registration.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.userKYC.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.user.deleteMany()

  // Create admin users
  console.log('👑 Creating admin users...')
  const adminPassword = await bcrypt.hash('admin123', 12)
  
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@jaipalesports.com',
      name: 'Super Admin',
      password: adminPassword,
      age: 30,
      phone: '+91-9999999999',
      emailVerified: new Date(),
      isVerified: true,
      role: UserRole.SUPER_ADMIN,
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@jaipalesports.com',
      name: 'Admin User',
      password: adminPassword,
      age: 28,
      phone: '+91-9999999998',
      emailVerified: new Date(),
      isVerified: true,
      role: UserRole.ADMIN,
    },
  })

  // Create regular users
  console.log('👥 Creating regular users...')
  const userPassword = await bcrypt.hash('user123', 12)
  const users = []

  for (let i = 0; i < 20; i++) {
    const name = getRandomElement(indianNames)
    const city = getRandomElement(indianCities)
    const state = getRandomElement(indianStates)
    const phone = phoneNumbers[i] || `+91-9876543${String(i).padStart(3, '0')}`
    const age = Math.floor(Math.random() * 15) + 18 // 18-32 years old

    const user = await prisma.user.create({
      data: {
        email: `user${i + 1}@jaipalesports.com`,
        name: name,
      password: userPassword,
        age: age,
        phone: phone,
        emailVerified: Math.random() > 0.1 ? new Date() : null, // 90% verified
        isVerified: Math.random() > 0.2, // 80% verified
      role: UserRole.USER,
    },
  })
    users.push(user)
  }

  // Create tournaments
  console.log('🏆 Creating tournaments...')
  const tournaments = []
  const games = Object.values(GameType)
  const statuses = Object.values(TournamentStatus)

  for (let i = 0; i < 15; i++) {
    const game = getRandomElement(games)
    const title = tournamentTitles[i] || `${game} Tournament ${i + 1}`
    const slug = generateSlug(title)
    const description = getRandomElement(tournamentDescriptions)
    const entryFee = Math.floor(Math.random() * 500) + 50 // 50-550
    const prizePool = entryFee * (Math.floor(Math.random() * 50) + 20) // 20-70x entry fee
    const maxPlayers = [32, 50, 64, 80, 100][Math.floor(Math.random() * 5)]
    const minPlayers = Math.floor(maxPlayers * 0.5)
    
    const now = new Date()
    const registrationStart = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
    const registrationEnd = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Next 30 days
    const startDate = new Date(registrationEnd.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // 1-7 days after registration ends
    const endDate = new Date(startDate.getTime() + Math.random() * 4 * 60 * 60 * 1000) // 1-4 hours duration

    const tournament = await prisma.tournament.create({
      data: {
        title: title,
        slug: slug,
        description: description,
        game: game,
        entryFee: entryFee,
        prizePool: prizePool,
        maxPlayers: maxPlayers,
        minPlayers: minPlayers,
        startDate: startDate,
        endDate: endDate,
        registrationStart: registrationStart,
        registrationEnd: registrationEnd,
        status: getRandomElement(statuses),
      rules: `
1. Players must be 18+ years old
2. No cheating or use of third-party software
3. Stable internet connection required
4. Respect other players and follow fair play
5. Tournament will be conducted in standard mode
6. Top players will receive prizes
7. Registration fee is non-refundable
      `.trim(),
        banner: `https://picsum.photos/400/200?random=${i}`,
      },
    })
    tournaments.push(tournament)
  }

  // Create KYC records
  console.log('📋 Creating KYC records...')
  for (const user of users) {
    if (Math.random() > 0.3) { // 70% of users have KYC
      const kycStatuses = Object.values(KYCStatus)
      const status = getRandomElement(kycStatuses)
      
      await prisma.userKYC.create({
        data: {
          userId: user.id,
          fullName: user.name || 'Unknown',
          dateOfBirth: new Date(2000 - Math.random() * 20, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          address: `${Math.floor(Math.random() * 999) + 1}, ${getRandomElement(['MG Road', 'Park Street', 'Main Road', 'Station Road', 'Church Street'])}`,
          city: getRandomElement(indianCities),
          state: getRandomElement(indianStates),
          pincode: (Math.floor(Math.random() * 900000) + 100000).toString(),
          idType: Math.random() > 0.5 ? 'Aadhar' : 'PAN',
          idNumber: Math.random() > 0.5 ? generateAadharNumber() : generatePANNumber(),
          idDocument: `/uploads/kyc/id_${user.id}.pdf`,
          addressProof: `/uploads/kyc/address_${user.id}.pdf`,
          status: status,
          verifiedAt: status === KYCStatus.APPROVED ? new Date() : null,
        },
      })
    }
  }

  // Create registrations and payments
  console.log('📝 Creating registrations and payments...')
  const allUsers = [superAdmin, admin, ...users]
  
  for (const user of allUsers) {
    const userTournaments = getRandomElements(tournaments, Math.floor(Math.random() * 5) + 1) // 1-5 tournaments per user
    
    for (const tournament of userTournaments) {
      const registrationStatuses = Object.values(RegistrationStatus)
      const paymentStatuses = Object.values(PaymentStatus)
      const status = getRandomElement(registrationStatuses)
      const paymentStatus = status === RegistrationStatus.CONFIRMED ? PaymentStatus.SUCCESS : 
                           status === RegistrationStatus.PENDING ? PaymentStatus.PENDING : PaymentStatus.FAILED

      const registration = await prisma.registration.create({
        data: {
          userId: user.id,
          tournamentId: tournament.id,
          status: status,
          registeredAt: generateRandomDate(tournament.registrationStart, new Date()),
        },
      })

      if (status === RegistrationStatus.CONFIRMED || status === RegistrationStatus.PENDING) {
        await prisma.payment.create({
          data: {
            userId: user.id,
            tournamentId: tournament.id,
            amount: tournament.entryFee,
            currency: 'INR',
            status: paymentStatus,
            razorpayId: paymentStatus === PaymentStatus.SUCCESS ? `pay_${Math.random().toString(36).substr(2, 9)}` : null,
            razorpayOrderId: `order_${Math.random().toString(36).substr(2, 9)}`,
            method: paymentStatus === PaymentStatus.SUCCESS ? getRandomElement(['UPI', 'Card', 'Net Banking', 'Wallet']) : null,
            description: `Entry fee for ${tournament.title}`,
            registration: {
              connect: { id: registration.id }
            }
          },
        })
      }
    }
  }

  // Create matches for tournaments
  console.log('🎮 Creating matches...')
  for (const tournament of tournaments) {
    if (tournament.status === TournamentStatus.ONGOING || tournament.status === TournamentStatus.COMPLETED) {
      const registrations = await prisma.registration.findMany({
        where: {
          tournamentId: tournament.id,
          status: RegistrationStatus.CONFIRMED
        },
        include: { user: true }
      })

      if (registrations.length > 0) {
        const rounds = Math.ceil(Math.log2(registrations.length))
        let matchNumber = 1

        for (let round = 1; round <= rounds; round++) {
          const matchesInRound = Math.ceil(registrations.length / Math.pow(2, round))
          
          for (let i = 0; i < matchesInRound; i++) {
            const matchStatuses = Object.values(MatchStatus)
            const status = tournament.status === TournamentStatus.COMPLETED ? MatchStatus.COMPLETED :
                          tournament.status === TournamentStatus.ONGOING && round === 1 ? MatchStatus.ONGOING : MatchStatus.SCHEDULED

            const player1 = registrations[i * 2]?.user
            const player2 = registrations[i * 2 + 1]?.user
            const winner = status === MatchStatus.COMPLETED && player1 && player2 ? 
                          getRandomElement([player1, player2]) : null

            await prisma.match.create({
              data: {
                tournamentId: tournament.id,
                round: round,
                matchNumber: matchNumber++,
                player1Id: player1?.id,
                player2Id: player2?.id,
                winnerId: winner?.id,
                status: status,
                scheduledAt: generateRandomDate(tournament.startDate, tournament.endDate),
                startedAt: status === MatchStatus.ONGOING || status === MatchStatus.COMPLETED ? 
                          generateRandomDate(tournament.startDate, tournament.endDate) : null,
                endedAt: status === MatchStatus.COMPLETED ? 
                        generateRandomDate(tournament.startDate, tournament.endDate) : null,
              },
            })
          }
        }
      }
    }
  }

  // Create payouts for completed tournaments
  console.log('💰 Creating payouts...')
  for (const tournament of tournaments) {
    if (tournament.status === TournamentStatus.COMPLETED) {
      const registrations = await prisma.registration.findMany({
        where: {
          tournamentId: tournament.id,
          status: RegistrationStatus.CONFIRMED
        },
        include: { user: true }
      })

      // Award prizes to top 3 players
      const topPlayers = registrations.slice(0, 3)
      const prizePoolNumber = Number(tournament.prizePool)
      const prizeAmounts = [prizePoolNumber * 0.5, prizePoolNumber * 0.3, prizePoolNumber * 0.2]

      for (let i = 0; i < topPlayers.length; i++) {
        const payoutStatuses = Object.values(PayoutStatus)
        const status = getRandomElement(payoutStatuses)

        await prisma.payout.create({
          data: {
            userId: topPlayers[i].user.id,
            tournamentId: tournament.id,
            amount: prizeAmounts[i],
            position: i + 1,
            status: status,
            razorpayId: status === PayoutStatus.PROCESSED ? `payout_${Math.random().toString(36).substr(2, 9)}` : null,
            processedAt: status === PayoutStatus.PROCESSED ? new Date() : null,
          },
        })
      }
    }
  }

  // Create notifications
  console.log('📧 Creating notifications...')
  for (const user of allUsers) {
    const notificationCount = Math.floor(Math.random() * 10) + 5 // 5-15 notifications per user
    
    for (let i = 0; i < notificationCount; i++) {
      const types = Object.values(NotificationType)
      const type = getRandomElement(types)
      const title = getRandomElement(notificationTitles)
      const message = getRandomElement(notificationMessages)
      const isRead = Math.random() > 0.3 // 70% read

      await prisma.notification.create({
        data: {
          userId: user.id,
          title: title,
          message: message,
          type: type,
          isRead: isRead,
          createdAt: generateRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()), // Last 30 days
        },
      })
    }
  }

  // Create some additional payments (wallet top-ups, etc.)
  console.log('💳 Creating additional payments...')
  for (const user of allUsers) {
    if (Math.random() > 0.5) { // 50% chance of wallet top-up
      await prisma.payment.create({
        data: {
          userId: user.id,
          amount: Math.floor(Math.random() * 2000) + 500, // 500-2500
          currency: 'INR',
          status: PaymentStatus.SUCCESS,
          razorpayId: `pay_${Math.random().toString(36).substr(2, 9)}`,
          razorpayOrderId: `order_${Math.random().toString(36).substr(2, 9)}`,
          method: getRandomElement(['UPI', 'Card', 'Net Banking', 'Wallet']),
          description: 'Wallet Top-up',
        },
      })
    }
  }

  console.log('✅ Comprehensive database seeded successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`👑 Super Admin: superadmin@jaipalesports.com / admin123`)
  console.log(`👑 Admin: admin@jaipalesports.com / admin123`)
  console.log(`👥 Regular Users: user1@jaipalesports.com to user20@jaipalesports.com / user123`)
  console.log(`🏆 Tournaments: ${tournaments.length} tournaments created`)
  console.log(`📋 KYC Records: ${Math.floor(users.length * 0.7)} KYC records created`)
  console.log(`📝 Registrations: Multiple registrations per user`)
  console.log(`💳 Payments: Entry fees and wallet top-ups`)
  console.log(`🎮 Matches: Created for ongoing/completed tournaments`)
  console.log(`💰 Payouts: Prize money for completed tournaments`)
  console.log(`📧 Notifications: 5-15 notifications per user`)
  console.log('')
  console.log('🎮 Your Jaipal Esports platform is ready with comprehensive test data!')
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