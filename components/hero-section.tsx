"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Trophy, Users, Zap, Shield, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface TournamentStats {
  totalTournaments: number
  activeTournaments: number
  totalPlayers: number
  totalPrizePool: number
}

interface FeaturedTournament {
  id: string
  slug: string
  title: string
  game: string
  entryFee: number
  prizePool: number
  maxPlayers: number
  currentPlayers: number
  status: string
}

export function HeroSection() {
  const [stats, setStats] = useState<TournamentStats | null>(null)
  const [featuredTournaments, setFeaturedTournaments] = useState<FeaturedTournament[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch tournament stats
        const statsResponse = await fetch('/api/tournaments/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Fetch featured tournaments for hero cards
        const tournamentsResponse = await fetch('/api/tournaments?featured=true&limit=2')
        if (tournamentsResponse.ok) {
          const tournamentsData = await tournamentsResponse.json()
          setFeaturedTournaments(tournamentsData)
        }
      } catch (error) {
        console.error('Error fetching hero data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  const getGameIcon = (game: string) => {
    switch (game) {
      case 'FREE_FIRE':
        return Zap
      default:
        return Gamepad2
    }
  }

  const getGameBadgeVariant = (index: number) => {
    return index === 0 ? "secondary" : "outline"
  }

  const getGameBadgeIcon = (index: number) => {
    return index === 0 ? Star : Users
  }

  const getGameBadgeText = (index: number) => {
    return index === 0 ? "Featured" : "Popular"
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Shield className="w-3 h-3 mr-1" />
                Legal & Compliant Gaming
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Compete in{" "}
                <span className="text-primary">Epic</span>{" "}
                eSports Tournaments
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Join India&apos;s premier eSports platform for PUBG, Free Fire, and more. 
                Compete for real prizes in legal, regulated tournaments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/tournaments">
                  <Trophy className="w-4 h-4 mr-2" />
                  Browse Tournaments
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    `${stats?.totalPlayers || 0}+`
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    `₹${Math.round((stats?.totalPrizePool || 0) / 1000)}K+`
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Prize Pool</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          <div className="relative">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {featuredTournaments.slice(0, 2).map((tournament, index) => {
                  const GameIcon = getGameIcon(tournament.game)
                  const BadgeIcon = getGameBadgeIcon(index)
                  
                  return (
                    <Card key={tournament.id} className={`p-6 ${index === 1 ? 'mt-8' : ''}`}>
                      <CardContent className="p-0 space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <GameIcon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold">{tournament.game}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Entry Fee</span>
                            <span className="font-semibold">₹{tournament.entryFee}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Prize Pool</span>
                            <span className="font-semibold">₹{tournament.prizePool.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Players</span>
                            <span className="font-semibold">{tournament.currentPlayers}/{tournament.maxPlayers}</span>
                          </div>
                        </div>
                        <Badge variant={getGameBadgeVariant(index)} className="w-fit">
                          <BadgeIcon className="w-3 h-3 mr-1" />
                          {getGameBadgeText(index)}
                        </Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
