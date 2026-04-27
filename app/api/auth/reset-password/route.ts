import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = resetPasswordSchema.parse(body)
    
    // In a real application, you would:
    // 1. Verify the reset token from your database
    // 2. Check if the token is still valid (not expired)
    // 3. Find the user associated with the token
    
    // For demo purposes, we'll simulate token validation
    // In production, you should have a proper token validation system
    
    // For now, we'll just check if the token exists and is valid format
    if (!validatedData.token || validatedData.token.length < 32) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }
    
    // In a real app, you would find the user by token:
    // const resetRecord = await prisma.passwordReset.findUnique({
    //   where: { token: validatedData.token },
    //   include: { user: true }
    // })
    
    // In a real app, you would find the user by token from a password reset table
    // For now, we'll find any user (this should be replaced with proper token validation)
    const testUser = await prisma.user.findFirst({
      where: { 
        email: {
          contains: "@nexusarena.com"
        }
      }
    })
    
    if (!testUser) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Update user password
    await prisma.user.update({
      where: { id: testUser.id },
      data: { password: hashedPassword }
    })
    
    // Create notification
    await prisma.notification.create({
      data: {
        userId: testUser.id,
        title: "Password Updated",
        message: "Your password has been successfully updated. If you didn't make this change, please contact support immediately.",
        type: "SUCCESS",
      }
    })
    
    // In a real app, you would also:
    // 1. Delete the used reset token
    // 2. Invalidate all existing sessions for security
    
    return NextResponse.json({
      message: "Password reset successfully"
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
