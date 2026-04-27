import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
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

    const matchId = params.id
    const { roomId, password } = await request.json()

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        roomId,
        password
      }
    })

    // Optionally notify players that lobby details are available
    if (roomId && password) {
      const players = [updatedMatch.player1Id, updatedMatch.player2Id].filter(Boolean) as string[]
      
      for (const playerId of players) {
        await prisma.notification.create({
          data: {
            userId: playerId,
            title: "Lobby Details Available",
            message: "Room ID and Password for your upcoming match have been posted. Check the match details page.",
            type: "INFO"
          }
        })
      }
    }

    return NextResponse.json(updatedMatch)

  } catch (error) {
    console.error("Lobby update API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
