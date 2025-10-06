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

    const payoutId = params.id

    // Get the payout
    const payout = await prisma.payout.findUnique({
      where: { id: payoutId },
      include: { user: true }
    })

    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 })
    }

    if (payout.status !== 'PENDING') {
      return NextResponse.json({ error: "Payout is not pending" }, { status: 400 })
    }

    // Here you would integrate with actual payment gateway (Razorpay, etc.)
    // For now, we'll just mark it as processed
    const updatedPayout = await prisma.payout.update({
      where: { id: payoutId },
      data: {
        status: 'PROCESSED',
        processedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Transform data
    const transformedPayout = {
      id: updatedPayout.id,
      amount: Number(updatedPayout.amount),
      position: updatedPayout.position,
      status: updatedPayout.status,
      createdAt: updatedPayout.createdAt.toISOString(),
      processedAt: updatedPayout.processedAt?.toISOString() || null,
      user: updatedPayout.user,
      tournament: { id: updatedPayout.tournamentId, title: 'Tournament' }
    }

    return NextResponse.json(transformedPayout)

  } catch (error) {
    console.error("Process payout API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
