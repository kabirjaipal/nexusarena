import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as { role?: string })?.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const matchId = params.id
    const { winnerId } = await request.json()

    if (!winnerId) {
      return NextResponse.json({ error: "Winner ID is required" }, { status: 400 })
    }

    // Get the match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        tournament: true
      }
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.status !== 'ONGOING') {
      return NextResponse.json({ error: "Match is not ongoing" }, { status: 400 })
    }

    // Verify winner is a player in this match
    if (match.player1Id !== winnerId && match.player2Id !== winnerId) {
      return NextResponse.json({ error: "Invalid winner ID" }, { status: 400 })
    }

    // Update match status to completed
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
        winnerId: winnerId
      },
      include: {
        tournament: {
          select: {
            id: true,
            title: true,
            game: true
          }
        }
      }
    })

    // Transform data
    const transformedMatch = {
      id: updatedMatch.id,
      round: updatedMatch.round,
      matchNumber: updatedMatch.matchNumber,
      status: updatedMatch.status,
      scheduledAt: updatedMatch.scheduledAt?.toISOString() || null,
      startedAt: updatedMatch.startedAt?.toISOString() || null,
      endedAt: updatedMatch.endedAt?.toISOString() || null,
      tournament: updatedMatch.tournament,
      player1: updatedMatch.player1Id ? { id: updatedMatch.player1Id, name: 'Player 1' } : null,
      player2: updatedMatch.player2Id ? { id: updatedMatch.player2Id, name: 'Player 2' } : null,
      winner: updatedMatch.winnerId ? { id: updatedMatch.winnerId, name: 'Winner' } : null
    }

    return NextResponse.json(transformedMatch)

  } catch (error) {
    console.error("End match API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
