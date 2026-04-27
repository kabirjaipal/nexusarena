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

    // Get recent registrations
    const recentRegistrations = await prisma.registration.findMany({
      take: 5,
      orderBy: { registeredAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true }
        },
        tournament: {
          select: { title: true }
        }
      }
    })

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      where: { status: "SUCCESS" },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    // Get recent KYC submissions
    const recentKYC = await prisma.userKYC.findMany({
      take: 5,
      orderBy: { submittedAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    // Combine and format activities
    const activities = []

    // Add registrations
    recentRegistrations.forEach(reg => {
      activities.push({
        id: `reg-${reg.id}`,
        type: "registration",
        description: `${reg.user.name} registered for ${reg.tournament.title}`,
        timestamp: reg.registeredAt.toISOString(),
        user: reg.user.name
      })
    })

    // Add payments
    recentPayments.forEach(payment => {
      activities.push({
        id: `payment-${payment.id}`,
        type: "payment",
        description: `${payment.user.name} made a payment of ₹${Number(payment.amount)}`,
        timestamp: payment.createdAt.toISOString(),
        user: payment.user.name
      })
    })

    // Add KYC submissions
    recentKYC.forEach(kyc => {
      activities.push({
        id: `kyc-${kyc.id}`,
        type: "kyc",
        description: `${kyc.user.name} submitted KYC documents`,
        timestamp: kyc.submittedAt.toISOString(),
        user: kyc.user.name
      })
    })

    // Sort by timestamp and take the most recent 10
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    return NextResponse.json(activities.slice(0, 10))

  } catch (error) {
    console.error("Admin activity API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
