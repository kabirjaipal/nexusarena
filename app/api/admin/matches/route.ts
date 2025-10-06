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

    const userRole = (session.user as { role?: string })?.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const matches = await prisma.match.findMany({
      include: {
        tournament: {
          select: {
            id: true,
            title: true,
            game: true
          }
        }
      },
      orderBy: [
        { round: 'asc' },
        { matchNumber: 'asc' }
      ]
    })

    // Transform data
    const transformedMatches = matches.map(match => ({
      id: match.id,
      round: match.round,
      matchNumber: match.matchNumber,
      status: match.status,
      scheduledAt: match.scheduledAt?.toISOString() || null,
      startedAt: match.startedAt?.toISOString() || null,
      endedAt: match.endedAt?.toISOString() || null,
      tournament: match.tournament,
      player1: match.player1Id ? { id: match.player1Id, name: 'Player 1' } : null,
      player2: match.player2Id ? { id: match.player2Id, name: 'Player 2' } : null,
      winner: match.winnerId ? { id: match.winnerId, name: 'Winner' } : null
    }))

    return NextResponse.json(transformedMatches)

  } catch (error) {
    console.error("Admin matches API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
