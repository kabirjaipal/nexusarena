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

    const payouts = await prisma.payout.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data
    const transformedPayouts = payouts.map(payout => ({
      id: payout.id,
      amount: Number(payout.amount),
      position: payout.position,
      status: payout.status,
      createdAt: payout.createdAt.toISOString(),
      processedAt: payout.processedAt?.toISOString() || null,
      user: payout.user,
      tournament: { id: payout.tournamentId, title: 'Tournament' }
    }))

    return NextResponse.json(transformedPayouts)

  } catch (error) {
    console.error("Admin payouts API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
