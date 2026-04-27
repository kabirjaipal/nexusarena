"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, User } from "lucide-react"

interface Match {
  id: string
  round: number
  matchNumber: number
  player1Id?: string
  player1Name: string
  player1Image?: string
  player2Id?: string
  player2Name: string
  player2Image?: string
  winnerId?: string
  winnerName?: string
  status: string
}

interface BracketViewProps {
  matches: Match[]
}

export function BracketView({ matches }: BracketViewProps) {
  // Group matches by round
  const rounds: { [key: number]: Match[] } = {}
  matches.forEach(match => {
    if (!rounds[match.round]) {
      rounds[match.round] = []
    }
    rounds[match.round].push(match)
  })

  const sortedRounds = Object.keys(rounds)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="flex gap-12 min-w-max px-4">
        {sortedRounds.map((roundNum) => (
          <div key={roundNum} className="flex flex-col gap-8">
            <div className="text-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Round {roundNum}
              </h3>
            </div>
            <div className="flex flex-col justify-around h-full gap-8">
              {rounds[roundNum].map((match) => (
                <div key={match.id} className="relative">
                  <Card className={`w-64 overflow-hidden border-2 transition-all ${match.status === 'ONGOING' ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
                    <CardContent className="p-0">
                      <div className="flex flex-col">
                        {/* Player 1 */}
                        <div className={`flex items-center justify-between p-3 border-b ${match.winnerId === match.player1Id ? 'bg-primary/5 font-bold' : ''}`}>
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <User className="h-3 w-3" />
                            </div>
                            <span className="text-sm truncate">{match.player1Name}</span>
                          </div>
                          {match.winnerId === match.player1Id && <Trophy className="h-3 w-3 text-yellow-500" />}
                        </div>
                        {/* Player 2 */}
                        <div className={`flex items-center justify-between p-3 ${match.winnerId === match.player2Id ? 'bg-primary/5 font-bold' : ''}`}>
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <User className="h-3 w-3" />
                            </div>
                            <span className="text-sm truncate">{match.player2Name}</span>
                          </div>
                          {match.winnerId === match.player2Id && <Trophy className="h-3 w-3 text-yellow-500" />}
                        </div>
                      </div>
                    </CardContent>
                    {match.status === 'ONGOING' && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-red-500 animate-pulse text-[10px]">LIVE</Badge>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
