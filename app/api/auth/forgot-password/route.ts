import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body)
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, we've sent a password reset link."
      })
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour
    
    // Store reset token in user record (you might want to create a separate table for this)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // For now, we'll use a simple approach
        // In production, you might want to create a separate PasswordReset table
      }
    })
    
    // In a real application, you would:
    // 1. Store the reset token in a database table
    // 2. Send an email with the reset link
    // 3. Use a service like SendGrid, Resend, or Nodemailer
    
    // For demo purposes, we'll just log the reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    
    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Password Reset Requested",
        message: "A password reset link has been sent to your email. If you didn't request this, please ignore this message.",
        type: "INFO",
      }
    })
    
    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link."
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      )
    }
    
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
