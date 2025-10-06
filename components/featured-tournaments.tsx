"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Trophy, Gamepad2, Zap, Clock } from "lucide-react"
import { formatDate, formatDateTime } from "@/lib/date-utils"
import Link from "next/link"

const featuredTournaments = [
  {
    id: "1",
    title: "PUBG Mobile Championship",
    game: "PUBG",
    description: "Join the ultimate PUBG Mobile tournament with massive prize pool",
    entryFee: 200,
    prizePool: 10000,
    maxPlayers: 100,
    currentPlayers: 67,
    startDate: "2024-02-15T18:00:00Z",
    status: "REGISTRATION_OPEN",
    banner: "/api/placeholder/400/200",
    gameIcon: Gamepad2,
    gameColor: "text-blue-500"
  },
  {
    id: "2", 
    title: "Free Fire Battle Royale",
    game: "FREE_FIRE",
    description: "Fast-paced Free Fire tournament for mobile gamers",
    entryFee: 100,
    prizePool: 5000,
    maxPlayers: 50,
    currentPlayers: 32,
    startDate: "2024-02-20T19:00:00Z",
    status: "REGISTRATION_OPEN",
    banner: "/api/placeholder/400/200",
    gameIcon: Zap,
    gameColor: "text-green-500"
  },
  {
    id: "3",
    title: "BGMI Pro League",
    game: "BGMI", 
    description: "Professional BGMI tournament with top players",
    entryFee: 300,
    prizePool: 15000,
    maxPlayers: 80,
    currentPlayers: 45,
    startDate: "2024-02-25T17:00:00Z",
    status: "UPCOMING",
    banner: "/api/placeholder/400/200",
    gameIcon: Gamepad2,
    gameColor: "text-orange-500"
  }
]

export function FeaturedTournaments() {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTournaments.map((tournament) => {
            const GameIcon = tournament.gameIcon
            const startDate = new Date(tournament.startDate)
            const isRegistrationOpen = tournament.status === "REGISTRATION_OPEN"
            
            return (
              <Card key={tournament.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  <div className="absolute top-4 left-4">
                    <Badge variant={isRegistrationOpen ? "default" : "secondary"}>
                      {isRegistrationOpen ? "Registration Open" : "Upcoming"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-background/80">
                      <GameIcon className={`w-3 h-3 mr-1 ${tournament.gameColor}`} />
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
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>₹{tournament.prizePool.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>{tournament.currentPlayers}/{tournament.maxPlayers}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Entry:</span>
                      <span>₹{tournament.entryFee}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-500" />
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
                    <Link href={`/tournaments/${tournament.id}`}>
                      {isRegistrationOpen ? "Register Now" : "View Details"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

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
