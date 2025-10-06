import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
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

    const { id: tournamentId } = await params

    // Check if tournament exists
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        registrations: true,
        matches: true,
        payments: true
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      )
    }

    // Check if tournament has active registrations or payments
    if (tournament.registrations.length > 0 || tournament.payments.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete tournament with existing registrations or payments" },
        { status: 400 }
      )
    }

    // Delete tournament (cascade will handle related records)
    await prisma.tournament.delete({
      where: { id: tournamentId }
    })

    return NextResponse.json({ message: "Tournament deleted successfully" })

  } catch (error) {
    console.error("Delete tournament API error:", error)
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

    const userRole = (session.user as { role?: string })?.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id: tournamentId } = await params
    const body = await request.json()

    // Check if tournament exists
    const existingTournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    })

    if (!existingTournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      )
    }

    // Generate new slug if title changed
    let slug = existingTournament.slug
    if (body.title && body.title !== existingTournament.title) {
      const generateSlug = (title: string): string => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .trim()
      }
      slug = generateSlug(body.title)
    }

    // Update tournament
    const updatedTournament = await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        title: body.title,
        slug: slug,
        description: body.description,
        game: body.game,
        entryFee: body.entryFee,
        prizePool: body.prizePool,
        maxPlayers: body.maxPlayers,
        minPlayers: body.minPlayers,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        registrationStart: body.registrationStart ? new Date(body.registrationStart) : undefined,
        registrationEnd: body.registrationEnd ? new Date(body.registrationEnd) : undefined,
        status: body.status,
        rules: body.rules,
        banner: body.banner,
        isActive: body.isActive,
        isFeatured: body.isFeatured
      }
    })

    return NextResponse.json(updatedTournament)

  } catch (error) {
    console.error("Update tournament API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
