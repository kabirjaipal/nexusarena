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

    // Update match status to completed and set winner
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
        winnerId: winnerId
      }
    })

    // --- BRACKET ADVANCEMENT LOGIC ---
    const nextRound = updatedMatch.round + 1
    const nextMatchNumber = Math.ceil(updatedMatch.matchNumber / 2)
    const isPlayer1InNextMatch = updatedMatch.matchNumber % 2 !== 0

    // Find if there's a next match
    const nextMatch = await prisma.match.findFirst({
      where: {
        tournamentId: match.tournamentId,
        round: nextRound,
        matchNumber: nextMatchNumber
      }
    })

    if (nextMatch) {
      // Advance winner to the next match
      await prisma.match.update({
        where: { id: nextMatch.id },
        data: isPlayer1InNextMatch 
          ? { player1Id: winnerId } 
          : { player2Id: winnerId }
      })
    } else {
      // This was likely the final. Check if we should mark tournament as completed
      // (Optional: handle prize distribution here)
    }

    // Notify the winner
    await prisma.notification.create({
      data: {
        userId: winnerId,
        title: "Match Victory!",
        message: `Congratulations! You won your match in ${match.tournament.title}. Check the bracket for your next opponent.`,
        type: "SUCCESS"
      }
    })

    return NextResponse.json({ success: true, match: updatedMatch })

  } catch (error) {
    console.error("End match API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
