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

    const tournamentId = params.id

    // Check if bracket already exists
    const existingMatches = await prisma.match.count({
      where: { tournamentId }
    })

    if (existingMatches > 0) {
      return NextResponse.json({ error: "Bracket already exists for this tournament" }, { status: 400 })
    }

    // Get confirmed registrations
    const registrations = await prisma.registration.findMany({
      where: {
        tournamentId,
        status: "CONFIRMED"
      },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    })

    if (registrations.length < 2) {
      return NextResponse.json({ error: "Not enough confirmed players to generate a bracket" }, { status: 400 })
    }

    // Shuffle players for fairness
    const players = registrations.map(r => r.userId).sort(() => Math.random() - 0.5)
    const playerCount = players.length

    // Calculate number of rounds
    const rounds = Math.ceil(Math.log2(playerCount))
    const totalMatchesInFirstRound = Math.pow(2, rounds - 1)

    // Generate matches for all rounds
    for (let r = 1; r <= rounds; r++) {
      const matchesInRound = Math.pow(2, rounds - r)
      
      for (let m = 1; m <= matchesInRound; m++) {
        let p1: string | null = null
        let p2: string | null = null

        // Assign players to the first round
        if (r === 1) {
          p1 = players[(m - 1) * 2] || null
          p2 = players[(m - 1) * 2 + 1] || null
        }

        await prisma.match.create({
          data: {
            tournamentId,
            round: r,
            matchNumber: m,
            player1Id: p1,
            player2Id: p2,
            status: (p1 && p2) ? "SCHEDULED" : "SCHEDULED" // In practice, handle byes
          }
        })
      }
    }

    // Update tournament status
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: "ONGOING" }
    })

    return NextResponse.json({ success: true, message: "Bracket generated successfully" })

  } catch (error) {
    console.error("Generate bracket API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
