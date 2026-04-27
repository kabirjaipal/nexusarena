import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentSlug } = await params

    const tournament = await prisma.tournament.findUnique({
      where: {
        slug: tournamentSlug,
        isActive: true
      },
      include: {
        registrations: {
          where: {
            status: 'CONFIRMED'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        matches: {
          include: {
            player1: { select: { name: true, image: true } },
            player2: { select: { name: true, image: true } },
            winner: { select: { name: true, image: true } }
          },
          orderBy: [
            { round: 'asc' },
            { matchNumber: 'asc' }
          ]
        }
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      )
    }

    // Transform data
    const transformedTournament = {
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
      updatedAt: tournament.updatedAt.toISOString(),
      registrations: tournament.registrations.map(reg => ({
        id: reg.id,
        userId: reg.userId,
        userName: reg.user.name,
        userImage: reg.user.image,
        registeredAt: reg.registeredAt.toISOString(),
        status: reg.status
      })),
      matches: tournament.matches.map(match => ({
        id: match.id,
        round: match.round,
        matchNumber: match.matchNumber,
        player1Id: match.player1Id,
        player1Name: match.player1?.name || "TBD",
        player1Image: match.player1?.image,
        player2Id: match.player2Id,
        player2Name: match.player2?.name || "TBD",
        player2Image: match.player2?.image,
        winnerId: match.winnerId,
        winnerName: match.winner?.name,
        status: match.status,
        scheduledAt: match.scheduledAt?.toISOString(),
        startedAt: match.startedAt?.toISOString(),
        endedAt: match.endedAt?.toISOString()
      }))
    }

    return NextResponse.json(transformedTournament)

  } catch (error) {
    console.error("Tournament detail API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
