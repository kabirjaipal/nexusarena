"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Trophy, Gamepad2, Zap, Clock, Loader2 } from "lucide-react"
import { formatDate, formatDateTime } from "@/lib/date-utils"
import Link from "next/link"
import { useEffect, useState } from "react"

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

export function FeaturedTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedTournaments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/tournaments?featured=true&limit=3')
        
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments')
        }
        
        const data = await response.json()
        setTournaments(data)
      } catch (err) {
        console.error('Error fetching featured tournaments:', err)
        setError(err instanceof Error ? err.message : 'Failed to load tournaments')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedTournaments()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured Tournaments
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the most exciting tournaments with the biggest prize pools
            </p>
          </div>
          
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured Tournaments
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the most exciting tournaments with the biggest prize pools
            </p>
          </div>
          
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
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured Tournaments
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the most exciting tournaments with the biggest prize pools
          </p>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured tournaments available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => {
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
                      <Badge variant={isRegistrationOpen ? "default" : "secondary"}>
                        {isRegistrationOpen ? "Registration Open" : "Upcoming"}
                      </Badge>
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/tournaments">
              View All Tournaments
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
