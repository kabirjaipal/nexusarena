import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Invalid phone number").optional(),
  age: z.string().optional().transform((val) => {
    if (!val || val === "") return undefined
    const num = parseInt(val)
    if (isNaN(num)) throw new Error("Age must be a valid number")
    if (num < 18) throw new Error("You must be at least 18 years old")
    return num
  }),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phone: true,
        age: true,
        image: true,
        isVerified: true,
        role: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = updateProfileSchema.parse(body)
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phone: true,
        age: true,
        image: true,
        isVerified: true,
        role: true,
        createdAt: true,
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Profile Updated",
        message: "Your profile information has been updated successfully.",
        type: "SUCCESS",
      }
    })

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.error("Update profile error:", error)
    
    if (error instanceof z.ZodError) {
      console.error("Zod validation errors:", error.issues)
      const firstError = error.issues?.[0]
      return NextResponse.json(
        { error: firstError?.message || "Validation error" },
        { status: 400 }
      )
    }
    
    // Handle other types of errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
