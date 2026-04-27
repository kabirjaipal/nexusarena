import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const game = searchParams.get("game")

    // Fetch users with their payouts (winnings)
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        payouts: {
          some: {
            status: "PROCESSED"
          }
        }
      },
      include: {
        payouts: {
          where: {
            status: "PROCESSED"
          },
          select: {
            amount: true,
            tournament: {
              select: {
                game: true
              }
            }
          }
        }
      }
    })

    // Filter by game if specified and calculate total winnings
    const leaderboard = users
      .map(user => {
        const relevantPayouts = game 
          ? user.payouts.filter(p => p.tournament.game === game)
          : user.payouts

        const totalWinnings = relevantPayouts.reduce((sum, p) => sum + Number(p.amount), 0)

        return {
          id: user.id,
          name: user.name,
          image: user.image,
          totalWinnings,
          matchCount: user.payouts.length // Simplified for MVP
        }
      })
      .filter(u => u.totalWinnings > 0)
      .sort((a, b) => b.totalWinnings - a.totalWinnings)
      .slice(0, limit)

    return NextResponse.json(leaderboard)

  } catch (error) {
    console.error("Leaderboard API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
