"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star, Target, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LeaderboardEntry {
  id: string
  name: string
  image: string | null
  totalWinnings: number
  matchCount: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [gameFilter, setGameFilter] = useState("all")

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)
        const url = gameFilter === "all" 
          ? "/api/leaderboard?limit=50" 
          : `/api/leaderboard?limit=50&game=${gameFilter}`
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setLeaderboard(data)
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [gameFilter])

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-6 w-6 text-yellow-500" />
      case 1: return <Medal className="h-6 w-6 text-gray-400" />
      case 2: return <Medal className="h-6 w-6 text-amber-600" />
      default: return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{index + 1}</span>
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Global <span className="text-primary">Leaderboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The top performers across all tournaments. Win matches, earn prize money, and climb the ranks.
          </p>
        </div>

        {/* Top 3 Spotlight */}
        {!isLoading && leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
            {/* 2nd Place */}
            <div className="order-2 md:order-1">
              <Card className="text-center border-t-4 border-t-gray-400 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="pt-8">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-20 w-20 border-4 border-gray-400">
                      <AvatarImage src={leaderboard[1].image || ""} />
                      <AvatarFallback className="text-xl">{leaderboard[1].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-gray-400 text-white rounded-full p-1">
                      <Medal className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{leaderboard[1].name}</h3>
                  <p className="text-primary font-bold text-lg mt-2">₹{leaderboard[1].totalWinnings.toLocaleString()}</p>
                  <Badge variant="secondary" className="mt-2">Rank 2</Badge>
                </CardContent>
              </Card>
            </div>

            {/* 1st Place */}
            <div className="order-1 md:order-2">
              <Card className="text-center border-t-4 border-t-yellow-500 shadow-2xl scale-105 transition-all bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-10 pb-8">
                  <div className="relative inline-block mb-6">
                    <Avatar className="h-28 w-28 border-4 border-yellow-500 shadow-yellow-500/20 shadow-2xl">
                      <AvatarImage src={leaderboard[0].image || ""} />
                      <AvatarFallback className="text-3xl">{leaderboard[0].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 -right-3 bg-yellow-500 text-white rounded-full p-2 animate-bounce">
                      <Trophy className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{leaderboard[0].name}</h3>
                  <p className="text-primary font-extrabold text-2xl mt-2">₹{leaderboard[0].totalWinnings.toLocaleString()}</p>
                  <Badge variant="default" className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1">Top Champion</Badge>
                </CardContent>
              </Card>
            </div>

            {/* 3rd Place */}
            <div className="order-3">
              <Card className="text-center border-t-4 border-t-amber-600 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="pt-8">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-20 w-20 border-4 border-amber-600">
                      <AvatarImage src={leaderboard[2].image || ""} />
                      <AvatarFallback className="text-xl">{leaderboard[2].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white rounded-full p-1">
                      <Medal className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{leaderboard[2].name}</h3>
                  <p className="text-primary font-bold text-lg mt-2">₹{leaderboard[2].totalWinnings.toLocaleString()}</p>
                  <Badge variant="secondary" className="mt-2">Rank 3</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Filter and List */}
        <Card className="shadow-xl">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b">
            <div>
              <CardTitle>Top Players</CardTitle>
              <CardDescription>Ranked by total prize money won</CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Select value={gameFilter} onValueChange={setGameFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Games" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  <SelectItem value="PUBG">PUBG Mobile</SelectItem>
                  <SelectItem value="FREE_FIRE">Free Fire</SelectItem>
                  <SelectItem value="BGMI">BGMI</SelectItem>
                  <SelectItem value="VALORANT">Valorant</SelectItem>
                  <SelectItem value="CS2">Counter-Strike 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Calculating rankings...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-4 text-left font-semibold text-sm">Rank</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm">Player</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm">Total Winnings</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm hidden md:table-cell">Tournament Wins</th>
                      <th className="px-6 py-4 text-right font-semibold text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          No players found for this game yet.
                        </td>
                      </tr>
                    ) : (
                      leaderboard.map((player, index) => (
                        <tr key={player.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {getRankIcon(index)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border group-hover:border-primary transition-colors">
                                <AvatarImage src={player.image || ""} />
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold">{player.name}</p>
                                <p className="text-xs text-muted-foreground">Pro Player</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-primary">₹{player.totalWinnings.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">{player.matchCount} Wins</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Badge variant="outline" className="text-success border-success/30 bg-success/5">
                              Active
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
