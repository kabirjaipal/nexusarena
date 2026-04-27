import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"
import crypto from "crypto"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: tournamentSlug } = await params
    const body = await request.json()

    // Find tournament by slug
    const tournament = await prisma.tournament.findUnique({
      where: { slug: tournamentSlug }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      )
    }

    // Check if tournament is accepting registrations
    if (tournament.status !== "REGISTRATION_OPEN") {
      return NextResponse.json(
        { error: "Tournament registration is not open" },
        { status: 400 }
      )
    }

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId: session.user.id,
        tournamentId: tournament.id
      }
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this tournament" },
        { status: 400 }
      )
    }

    // Check if tournament is full
    const currentRegistrations = await prisma.registration.count({
      where: { tournamentId: tournament.id }
    })

    if (currentRegistrations >= tournament.maxPlayers) {
      return NextResponse.json(
        { error: "Tournament is full" },
        { status: 400 }
      )
    }

    // Check if user is verified (if required)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user?.isVerified) {
      return NextResponse.json(
        { error: "Please verify your account before registering for tournaments" },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const orderOptions = {
      amount: Number(tournament.entryFee) * 100, // Convert to paise
      currency: "INR",
      receipt: `tournament_${tournament.id}_user_${session.user.id}_${Date.now()}`,
      notes: {
        tournamentId: tournament.id,
        userId: session.user.id,
        tournamentTitle: tournament.title
      }
    }

    const order = await razorpay.orders.create(orderOptions)

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        tournamentId: tournament.id,
        amount: tournament.entryFee,
        currency: "INR",
        status: "PENDING",
        razorpayOrderId: order.id,
        paymentMethod: "RAZORPAY"
      }
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment.id,
      key: process.env.RAZORPAY_KEY_ID
    })

  } catch (error) {
    console.error("Tournament registration API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: tournamentSlug } = await params
    const body = await request.json()

    const { paymentId, razorpayPaymentId, razorpaySignature } = body

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${body.razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    // Find the payment record
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { tournament: true }
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      )
    }

    if (payment.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: razorpayPaymentId,
        razorpaySignature: razorpaySignature,
        paidAt: new Date()
      }
    })

    // Create tournament registration
    const registration = await prisma.registration.create({
      data: {
        userId: session.user.id,
        tournamentId: payment.tournamentId,
        status: "CONFIRMED",
        registeredAt: new Date()
      }
    })

    // Create success notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "SUCCESS",
        title: "Tournament Registration Successful",
        message: `You have successfully registered for ${payment.tournament.title}`,
        isRead: false
      }
    })

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      message: "Registration successful!"
    })

  } catch (error) {
    console.error("Payment verification API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
