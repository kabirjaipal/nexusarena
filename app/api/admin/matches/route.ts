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

    const matches = await prisma.match.findMany({
      include: {
        tournament: {
          select: {
            id: true,
            title: true,
            game: true
          }
        },
        player1: { select: { id: true, name: true, image: true } },
        player2: { select: { id: true, name: true, image: true } },
        winner: { select: { id: true, name: true, image: true } }
      },
      orderBy: [
        { tournament: { title: 'asc' } },
        { round: 'asc' },
        { matchNumber: 'asc' }
      ]
    })

    return NextResponse.json(matches)

  } catch (error) {
    console.error("Admin matches API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
