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

    const userId = session.user.id

    // Fetch all processed payouts (winnings)
    const payouts = await prisma.payout.findMany({
      where: {
        userId: userId,
        status: "PROCESSED"
      },
      include: {
        tournament: {
          select: {
            title: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Fetch all withdrawal requests
    const withdrawals = await prisma.withdrawalRequest.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" }
    })

    // Calculate balance
    const totalWinnings = payouts.reduce((sum, p) => sum + Number(p.amount), 0)
    const totalWithdrawn = withdrawals
      .filter(w => w.status === "COMPLETED" || w.status === "PROCESSING")
      .reduce((sum, w) => sum + Number(w.amount), 0)
    
    const balance = totalWinnings - totalWithdrawn

    // Combine into a history log
    const history = [
      ...payouts.map(p => ({
        id: p.id,
        type: "WINNING",
        amount: Number(p.amount),
        status: "COMPLETED",
        description: `Prize for ${p.tournament.title}`,
        date: p.createdAt
      })),
      ...withdrawals.map(w => ({
        id: w.id,
        type: "WITHDRAWAL",
        amount: Number(w.amount),
        status: w.status,
        description: `Withdrawal to ${w.method || 'Account'}`,
        date: w.createdAt
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({
      balance,
      totalWinnings,
      totalWithdrawn,
      history
    })

  } catch (error) {
    console.error("Wallet API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { amount, method, details } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Check if user has sufficient balance
    const payouts = await prisma.payout.findMany({
      where: { userId, status: "PROCESSED" }
    })
    const withdrawals = await prisma.withdrawalRequest.findMany({
      where: { userId, status: { in: ["COMPLETED", "PROCESSING", "PENDING"] } }
    })

    const totalWinnings = payouts.reduce((sum, p) => sum + Number(p.amount), 0)
    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + Number(w.amount), 0)
    const balance = totalWinnings - totalWithdrawn

    if (amount > balance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId,
        amount,
        method,
        details,
        status: "PENDING"
      }
    })

    return NextResponse.json(withdrawal)

  } catch (error) {
    console.error("Withdrawal request error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
