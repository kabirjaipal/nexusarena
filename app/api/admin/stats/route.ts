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

    // Get total users
    const totalUsers = await prisma.user.count({
      where: { role: "USER" }
    })

    // Get total tournaments
    const totalTournaments = await prisma.tournament.count({
      where: { isActive: true }
    })

    // Get active tournaments
    const activeTournaments = await prisma.tournament.count({
      where: {
        isActive: true,
        status: {
          in: ["REGISTRATION_OPEN", "ONGOING"]
        }
      }
    })

    // Get total payments and revenue
    const payments = await prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
      _count: { id: true }
    })

    const totalPayments = payments._count.id
    const totalRevenue = Number(payments._sum.amount || 0)

    // Get pending KYC
    const pendingKYC = await prisma.userKYC.count({
      where: { status: "PENDING" }
    })

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentRegistrations = await prisma.registration.count({
      where: {
        registeredAt: {
          gte: sevenDaysAgo
        }
      }
    })

    // Get total payouts
    const totalPayouts = await prisma.payout.count({
      where: { status: "PROCESSED" }
    })

    return NextResponse.json({
      totalUsers,
      totalTournaments,
      totalPayments,
      totalRevenue,
      activeTournaments,
      pendingKYC,
      recentRegistrations,
      totalPayouts
    })

  } catch (error) {
    console.error("Admin stats API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
