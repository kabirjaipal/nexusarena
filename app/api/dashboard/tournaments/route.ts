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

    // Get user's tournament registrations with tournament details
    const registrations = await prisma.registration.findMany({
      where: { userId: session.user.id },
      include: {
        tournament: true,
        payment: true
      },
      orderBy: { registeredAt: "desc" }
    })

    // Get user's payouts for winnings
    const payouts = await prisma.payout.findMany({
      where: { userId: session.user.id }
    })

    // Combine registrations with payout information
    const tournaments = registrations.map(registration => {
      const payout = payouts.find(p => p.tournamentId === registration.tournamentId)
      
      return {
        id: registration.id,
        title: registration.tournament.title,
        game: registration.tournament.game,
        entryFee: Number(registration.tournament.entryFee),
        prizePool: Number(registration.tournament.prizePool),
        status: registration.tournament.status,
        registeredAt: registration.registeredAt.toISOString(),
        startDate: registration.tournament.startDate.toISOString(),
        position: payout?.position || null,
        winnings: payout ? Number(payout.amount) : null
      }
    })

    return NextResponse.json(tournaments)

  } catch (error) {
    console.error("Dashboard tournaments error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
