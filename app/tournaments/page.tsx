"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Trophy, Gamepad2, Zap, Clock, Loader2, Search, Filter } from "lucide-react"
import { formatDate, formatDateTime } from "@/lib/date-utils"
import Link from "next/link"

interface Tournament {
  id: string
  slug: string
  title: string
  game: string
  description: string
  entryFee: number
  prizePool: number
  maxPlayers: number
  currentPlayers: number
  startDate: string
  status: string
  banner?: string
}

const getGameIcon = (game: string) => {
  switch (game) {
    case 'FREE_FIRE':
      return Zap
    default:
      return Gamepad2
  }
}

const getGameColor = (game: string) => {
  switch (game) {
    case 'PUBG':
      return 'text-pubg'
    case 'FREE_FIRE':
      return 'text-freefire'
    case 'BGMI':
      return 'text-bgmi'
    case 'VALORANT':
      return 'text-valorant'
    case 'CS2':
      return 'text-cs2'
    default:
      return 'text-primary'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'REGISTRATION_OPEN':
      return <Badge variant="default">Registration Open</Badge>
    case 'ONGOING':
      return <Badge variant="secondary">Ongoing</Badge>
    case 'COMPLETED':
      return <Badge variant="outline">Completed</Badge>
    case 'UPCOMING':
      return <Badge variant="secondary">Upcoming</Badge>
    case 'REGISTRATION_CLOSED':
      return <Badge variant="destructive">Registration Closed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [gameFilter, setGameFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/tournaments?limit=50')
        
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments')
        }
        
        const data = await response.json()
        setTournaments(data)
        setFilteredTournaments(data)
      } catch (err) {
        console.error('Error fetching tournaments:', err)
        setError(err instanceof Error ? err.message : 'Failed to load tournaments')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTournaments()
  }, [])

  useEffect(() => {
    let filtered = tournaments

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tournament =>
        tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by game
    if (gameFilter !== "all") {
      filtered = filtered.filter(tournament => tournament.game === gameFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(tournament => tournament.status === statusFilter)
    }

    setFilteredTournaments(filtered)
  }, [tournaments, searchTerm, gameFilter, statusFilter])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive">Error loading tournaments: {error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
          <p className="text-muted-foreground">
            Discover and join exciting eSports tournaments
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={gameFilter} onValueChange={setGameFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="PUBG">PUBG</SelectItem>
                <SelectItem value="FREE_FIRE">Free Fire</SelectItem>
                <SelectItem value="BGMI">BGMI</SelectItem>
                <SelectItem value="VALORANT">Valorant</SelectItem>
                <SelectItem value="CS2">CS2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="REGISTRATION_OPEN">Registration Open</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTournaments.length} of {tournaments.length} tournaments
          </p>
        </div>

        {/* Tournaments Grid */}
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-12">
            <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tournaments found</h3>
            <p className="text-muted-foreground">
              {searchTerm || gameFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters to see more tournaments."
                : "No tournaments are available at the moment. Check back later!"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => {
              const GameIcon = getGameIcon(tournament.game)
              const gameColor = getGameColor(tournament.game)
              const startDate = new Date(tournament.startDate)
              const isRegistrationOpen = tournament.status === "REGISTRATION_OPEN"
              
              return (
                <Card key={tournament.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    {tournament.banner && (
                      <img 
                        src={tournament.banner} 
                        alt={tournament.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(tournament.status)}
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-background/80">
                        <GameIcon className={`w-3 h-3 mr-1 ${gameColor}`} />
                        {tournament.game}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{tournament.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tournament.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-warning" />
                        <span>₹{tournament.prizePool.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-accent" />
                        <span>{tournament.currentPlayers}/{tournament.maxPlayers}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">Entry:</span>
                        <span>₹{tournament.entryFee}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(startDate)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Starts {formatDateTime(startDate)}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/tournaments/${tournament.slug}`}>
                        {isRegistrationOpen ? "Register Now" : "View Details"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
