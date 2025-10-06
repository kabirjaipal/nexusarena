import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const game = searchParams.get('game')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const featured = searchParams.get('featured') === 'true'

    // Build where clause
    const where: any = {
      isActive: true
    }

    if (game) {
      where.game = game
    }

    if (status) {
      where.status = status
    }

    if (featured) {
      where.status = {
        in: ['REGISTRATION_OPEN', 'UPCOMING']
      }
    }

    // Get tournaments with registration count
    const tournaments = await prisma.tournament.findMany({
      where,
      include: {
        registrations: {
          where: {
            status: 'CONFIRMED'
          }
        }
      },
      orderBy: featured ? [
        { status: 'asc' },
        { startDate: 'asc' }
      ] : [
        { createdAt: 'desc' }
      ],
      take: limit
    })

    // Transform data to include current player count
    const transformedTournaments = tournaments.map(tournament => ({
      id: tournament.id,
      slug: tournament.slug,
      title: tournament.title,
      description: tournament.description,
      game: tournament.game,
      entryFee: Number(tournament.entryFee),
      prizePool: Number(tournament.prizePool),
      maxPlayers: tournament.maxPlayers,
      minPlayers: tournament.minPlayers,
      currentPlayers: tournament.registrations.length,
      startDate: tournament.startDate.toISOString(),
      endDate: tournament.endDate.toISOString(),
      registrationStart: tournament.registrationStart.toISOString(),
      registrationEnd: tournament.registrationEnd.toISOString(),
      status: tournament.status,
      rules: tournament.rules,
      banner: tournament.banner,
      createdAt: tournament.createdAt.toISOString(),
      updatedAt: tournament.updatedAt.toISOString()
    }))

    return NextResponse.json(transformedTournaments)

  } catch (error) {
    console.error("Tournaments API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
