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

    const payments = await prisma.payment.findMany({
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
    const transformedPayments = payments.map(payment => ({
      id: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      description: payment.description,
      createdAt: payment.createdAt.toISOString(),
      user: payment.user,
      tournament: payment.tournamentId ? { id: payment.tournamentId, title: 'Tournament' } : null
    }))

    return NextResponse.json(transformedPayments)

  } catch (error) {
    console.error("Admin payments API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
