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

    const users = await prisma.user.findMany({
      include: {
        kyc: {
          select: { status: true }
        },
        registrations: {
          select: { id: true }
        },
        payouts: {
          where: { status: "PROCESSED" },
          select: { amount: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      role: user.role,
      isVerified: user.isVerified,
      emailVerified: user.emailVerified?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
      kycStatus: user.kyc?.status || null,
      totalRegistrations: user.registrations.length,
      totalWinnings: user.payouts.reduce((sum, payout) => sum + Number(payout.amount), 0)
    }))

    return NextResponse.json(transformedUsers)

  } catch (error) {
    console.error("Admin users API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
