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

    const tournaments = await prisma.tournament.findMany({
      include: {
        registrations: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data to include current player count
    const transformedTournaments = tournaments.map(tournament => ({
      id: tournament.id,
      slug: tournament.slug,
      title: tournament.title,
      game: tournament.game,
      description: tournament.description,
      entryFee: Number(tournament.entryFee),
      prizePool: Number(tournament.prizePool),
      maxPlayers: tournament.maxPlayers,
      minPlayers: tournament.minPlayers,
      currentPlayers: tournament.registrations.length,
      startDate: tournament.startDate.toISOString(),
      endDate: tournament.endDate.toISOString(),
      registrationStart: tournament.registrationStart.toISOString(),
      registrationEnd: tournament.registrationEnd.toISOString(),
      status: tournament.status,
      isActive: tournament.isActive,
      createdAt: tournament.createdAt.toISOString(),
      updatedAt: tournament.updatedAt.toISOString()
    }))

    return NextResponse.json(transformedTournaments)

  } catch (error) {
    console.error("Admin tournaments API error:", error)
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

    const userRole = (session.user as { role?: string })?.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    
    // Generate slug from title
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim()
    }

    const slug = generateSlug(body.title)

    const tournament = await prisma.tournament.create({
      data: {
        title: body.title,
        slug: slug,
        description: body.description,
        game: body.game,
        entryFee: body.entryFee,
        prizePool: body.prizePool,
        maxPlayers: body.maxPlayers,
        minPlayers: body.minPlayers,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        registrationStart: new Date(body.registrationStart),
        registrationEnd: new Date(body.registrationEnd),
        status: body.status || 'UPCOMING',
        rules: body.rules || '',
        banner: body.banner || `https://picsum.photos/400/200?random=${Date.now()}`,
        isActive: body.isActive !== false,
        isFeatured: body.isFeatured || false
      }
    })

    return NextResponse.json(tournament, { status: 201 })

  } catch (error) {
    console.error("Create tournament API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
