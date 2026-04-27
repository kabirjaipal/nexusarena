import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
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

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        registrations: {
          include: {
            user: { select: { name: true } }
          }
        },
        matches: true
      }
    })

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    const transformedTournament = {
      ...tournament,
      entryFee: Number(tournament.entryFee),
      prizePool: Number(tournament.prizePool),
      currentPlayers: tournament.registrations.length,
      registrations: tournament.registrations.map(reg => ({
        id: reg.id,
        userId: reg.userId,
        userName: reg.user.name,
        status: reg.status,
        registeredAt: reg.registeredAt.toISOString()
      }))
    }

    return NextResponse.json(transformedTournament)

  } catch (error) {
    console.error("Admin tournament detail API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
