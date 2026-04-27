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
    const { status, reason } = body

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Use a transaction to update both KYC and User verification status
    await prisma.$transaction(async (tx) => {
      await tx.userKYC.update({
        where: { userId: userId },
        data: {
          status: status,
          verifiedAt: status === "APPROVED" ? new Date() : null
        }
      })

      if (status === "APPROVED") {
        await tx.user.update({
          where: { id: userId },
          data: { isVerified: true }
        })
      } else {
        await tx.user.update({
          where: { id: userId },
          data: { isVerified: false }
        })
      }

      // Notify the user
      await tx.notification.create({
        data: {
          userId: userId,
          title: status === "APPROVED" ? "KYC Approved!" : "KYC Rejected",
          message: status === "APPROVED" 
            ? "Your identity has been verified. You can now register for all tournaments."
            : `Your KYC was rejected. ${reason || "Please check your details and try again."}`,
          type: status === "APPROVED" ? "SUCCESS" : "ERROR"
        }
      })
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Admin KYC update API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
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
    
    const kyc = await prisma.userKYC.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    if (!kyc) {
      return NextResponse.json({ error: "KYC not found" }, { status: 404 })
    }

    return NextResponse.json(kyc)

  } catch (error) {
    console.error("Admin KYC fetch API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
