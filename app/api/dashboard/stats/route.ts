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

    // Get user's tournament registrations
    const registrations = await prisma.registration.findMany({
      where: { userId: session.user.id },
      include: {
        tournament: true,
        payment: true
      }
    })

    // Calculate stats
    const totalTournaments = registrations.length
    const activeRegistrations = registrations.filter(
      reg => reg.status === "CONFIRMED" && 
      new Date(reg.tournament.startDate) > new Date()
    ).length

    // Calculate total winnings from payouts
    const payouts = await prisma.payout.findMany({
      where: { 
        userId: session.user.id,
        status: "PROCESSED"
      }
    })

    const totalWinnings = payouts.reduce((sum, payout) => sum + Number(payout.amount), 0)

    // Count upcoming matches (simplified - in real app you'd have proper match scheduling)
    const upcomingMatches = registrations.filter(
      reg => reg.status === "CONFIRMED" && 
      new Date(reg.tournament.startDate) > new Date() &&
      new Date(reg.tournament.startDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
    ).length

    return NextResponse.json({
      totalTournaments,
      activeRegistrations,
      totalWinnings,
      upcomingMatches
    })

  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
