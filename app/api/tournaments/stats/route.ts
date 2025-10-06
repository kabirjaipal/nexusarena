import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Get tournament statistics
    const totalTournaments = await prisma.tournament.count({
      where: { isActive: true }
    })

    const activeTournaments = await prisma.tournament.count({
      where: {
        isActive: true,
        status: {
          in: ['REGISTRATION_OPEN', 'ONGOING']
        }
      }
    })

    const totalPlayers = await prisma.registration.count({
      where: {
        status: 'CONFIRMED'
      }
    })

    const totalPrizePool = await prisma.tournament.aggregate({
      where: {
        isActive: true,
        status: {
          in: ['REGISTRATION_OPEN', 'ONGOING', 'UPCOMING']
        }
      },
      _sum: {
        prizePool: true
      }
    })

    const gameStats = await prisma.tournament.groupBy({
      by: ['game'],
      where: {
        isActive: true
      },
      _count: {
        id: true
      },
      _sum: {
        prizePool: true
      }
    })

    const transformedGameStats = gameStats.map(stat => ({
      game: stat.game,
      count: stat._count.id,
      totalPrizePool: Number(stat._sum.prizePool || 0)
    }))

    return NextResponse.json({
      totalTournaments,
      activeTournaments,
      totalPlayers,
      totalPrizePool: Number(totalPrizePool._sum.prizePool || 0),
      gameStats: transformedGameStats
    })

  } catch (error) {
    console.error("Tournament stats API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
