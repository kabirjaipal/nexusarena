import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch matches participated in
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player1Id: userId },
          { player2Id: userId }
        ]
      },
      select: {
        id: true,
        winnerId: true,
        status: true
      }
    })

    // Fetch tournament wins
    const payouts = await prisma.payout.findMany({
      where: { userId, status: "PROCESSED" }
    })

    const totalMatches = matches.length
    const completedMatches = matches.filter(m => m.status === "COMPLETED")
    const matchWins = completedMatches.filter(m => m.winnerId === userId).length
    const winRate = totalMatches > 0 ? (matchWins / totalMatches) * 100 : 0
    
    const totalWinnings = payouts.reduce((sum, p) => sum + Number(p.amount), 0)
    const tournamentCount = await prisma.registration.count({
      where: { userId, status: "CONFIRMED" }
    })

    return NextResponse.json({
      totalMatches,
      matchWins,
      winRate: Math.round(winRate * 10) / 10,
      totalWinnings,
      tournamentCount
    })

  } catch (error) {
    console.error("Profile stats API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
