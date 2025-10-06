import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: userId } = await params
    const body = await request.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: body.isVerified
      }
    })

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: userId,
        type: body.isVerified ? "SUCCESS" : "WARNING",
        title: body.isVerified ? "Account Verified" : "Account Verification Removed",
        message: body.isVerified 
          ? "Your account has been verified by an administrator."
          : "Your account verification has been removed by an administrator.",
        isRead: false
      }
    })

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.error("User verification API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
