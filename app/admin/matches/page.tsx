"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Gamepad2,
  Search,
  Eye,
  Play,
  CheckCircle2,
  Calendar,
  Trophy,
  Users,
  Clock,
  Loader2,
  Plus,
  AlertCircle,
  Edit
} from "lucide-react"
import { formatDate, formatDateTime } from "@/lib/date-utils"
import Link from "next/link"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Match {
  id: string
  round: number
  matchNumber: number
  status: string
  scheduledAt: string | null
  startedAt: string | null
  endedAt: string | null
  tournament: {
    id: string
    title: string
    game: string
  }
  player1?: {
    id: string
    name: string
  }
  player2?: {
    id: string
    name: string
  }
  winner?: {
    id: string
    name: string
  }
  roomId?: string
  password?: string
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tournamentFilter, setTournamentFilter] = useState("all")
  
  // Selection state
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false)
  const [isLobbyDialogOpen, setIsLobbyDialogOpen] = useState(false)
  const [lobbyRoomId, setLobbyRoomId] = useState("")
  const [lobbyPassword, setLobbyPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/matches')
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
        setFilteredMatches(data)
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
      toast.error("Failed to load matches")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  useEffect(() => {
    let filtered = matches
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(match =>
        match.tournament.title.toLowerCase().includes(term) ||
        match.player1?.name.toLowerCase().includes(term) ||
        match.player2?.name.toLowerCase().includes(term)
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(match => match.status === statusFilter)
    }
    if (tournamentFilter !== "all") {
      filtered = filtered.filter(match => match.tournament.id === tournamentFilter)
    }
    setFilteredMatches(filtered)
  }, [matches, searchTerm, statusFilter, tournamentFilter])

  const handleStartMatch = async (matchId: string) => {
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/admin/matches/${matchId}/start`, {
        method: 'POST'
      })
      if (response.ok) {
        toast.success("Match started")
        fetchMatches()
      } else {
        toast.error("Failed to start match")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEndMatch = async (winnerId: string) => {
    if (!selectedMatch) return
    
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/admin/matches/${selectedMatch.id}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId })
      })

      if (response.ok) {
        toast.success("Match results recorded and bracket updated")
        setIsWinnerDialogOpen(false)
        setSelectedMatch(null)
        fetchMatches()
      } else {
        toast.error("Failed to record result")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdateLobby = async () => {
    if (!selectedMatch) return
    
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/admin/matches/${selectedMatch.id}/lobby`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: lobbyRoomId, password: lobbyPassword })
      })

      if (response.ok) {
        toast.success("Lobby details updated and players notified")
        setIsLobbyDialogOpen(false)
        fetchMatches()
      } else {
        toast.error("Failed to update lobby")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const tournaments = Array.from(new Set(matches.map(m => m.tournament.id))).map(id => {
    const m = matches.find(match => match.tournament.id === id)
    return { id: m!.tournament.id, title: m!.tournament.title }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Match Control Center</h1>
          <p className="text-muted-foreground mt-1">
            Real-time bracket management and score reporting.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchMatches}>
            <Clock className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/tournaments">
              <Plus className="h-4 w-4 mr-2" />
              Manage Tournaments
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Matches", value: matches.length, icon: Gamepad2, color: "text-blue-500" },
          { label: "Live Now", value: matches.filter(m => m.status === 'ONGOING').length, icon: Play, color: "text-green-500" },
          { label: "Pending", value: matches.filter(m => m.status === 'SCHEDULED').length, icon: Calendar, color: "text-yellow-500" },
          { label: "Completed", value: matches.filter(m => m.status === 'COMPLETED').length, icon: Trophy, color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-muted`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Active Bracket Matches</CardTitle>
              <CardDescription>Update winners to automatically advance players in the bracket.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  className="pl-8 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="bg-background border rounded-md px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="ONGOING">Live</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Done</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Bracket</TableHead>
                  <TableHead>Tournament / Game</TableHead>
                  <TableHead>Matchup</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No matches found.</TableCell>
                  </TableRow>
                ) : (
                  filteredMatches.map((match) => (
                    <TableRow key={match.id} className="hover:bg-muted/30">
                      <TableCell>
                        <Badge variant="outline" className="font-mono">R{match.round}-M{match.matchNumber}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">{match.tournament.title}</span>
                          <span className="text-xs text-muted-foreground">{match.tournament.game}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`flex-1 p-2 rounded border ${match.winner?.id === match.player1?.id ? 'bg-primary/5 border-primary/20' : 'bg-muted/20'}`}>
                            <span className="text-sm font-medium">{match.player1?.name || "TBD"}</span>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">VS</span>
                          <div className={`flex-1 p-2 rounded border ${match.winner?.id === match.player2?.id ? 'bg-primary/5 border-primary/20' : 'bg-muted/20'}`}>
                            <span className="text-sm font-medium">{match.player2?.name || "TBD"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {match.status === 'ONGOING' ? (
                          <Badge className="bg-green-500 hover:bg-green-600 animate-pulse">Live Now</Badge>
                        ) : match.status === 'COMPLETED' ? (
                          <Badge variant="secondary">Completed</Badge>
                        ) : (
                          <Badge variant="outline">Scheduled</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {match.status === 'SCHEDULED' && match.player1 && match.player2 && (
                            <Button size="sm" onClick={() => handleStartMatch(match.id)} disabled={isProcessing}>
                              <Play className="h-3 w-3 mr-1" /> Start
                            </Button>
                          )}
                          {match.status !== 'COMPLETED' && (
                            <Button size="sm" variant="outline" onClick={() => {
                              setSelectedMatch(match)
                              setIsLobbyDialogOpen(true)
                              setLobbyRoomId(match.roomId || "")
                              setLobbyPassword(match.password || "")
                            }}>
                              <Edit className="h-3 w-3 mr-1" /> Lobby
                            </Button>
                          )}
                          {match.status === 'ONGOING' && (
                            <Button size="sm" variant="default" onClick={() => {
                              setSelectedMatch(match)
                              setIsWinnerDialogOpen(true)
                            }}>
                              <CheckCircle2 className="h-3 w-3 mr-1" /> End Match
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/matches/${match.id}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Winner Selection Dialog */}
      <Dialog open={isWinnerDialogOpen} onOpenChange={setIsWinnerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Declare Winner</DialogTitle>
            <DialogDescription>
              Select the player who won the match. This will automatically advance them to the next round.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div 
              className="flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
              onClick={() => handleEndMatch(selectedMatch?.player1?.id!)}
            >
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Player 1</span>
                <span className="font-bold text-lg">{selectedMatch?.player1?.name}</span>
              </div>
              <Trophy className="h-6 w-6 text-yellow-500 opacity-20" />
            </div>
            <div 
              className="flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
              onClick={() => handleEndMatch(selectedMatch?.player2?.id!)}
            >
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Player 2</span>
                <span className="font-bold text-lg">{selectedMatch?.player2?.name}</span>
              </div>
              <Trophy className="h-6 w-6 text-yellow-500 opacity-20" />
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              <span>Winners are moved to Round {selectedMatch ? selectedMatch.round + 1 : "?"}</span>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lobby Management Dialog */}
      <Dialog open={isLobbyDialogOpen} onOpenChange={setIsLobbyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Lobby Credentials</DialogTitle>
            <DialogDescription>
              Set the Room ID and Password. Players will be notified once saved.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">Room ID</Label>
              <Input 
                id="roomId" 
                placeholder="e.g., 1234567" 
                value={lobbyRoomId}
                onChange={(e) => setLobbyRoomId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lobbyPassword">Password</Label>
              <Input 
                id="lobbyPassword" 
                placeholder="e.g., pass123" 
                value={lobbyPassword}
                onChange={(e) => setLobbyPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLobbyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateLobby} disabled={isProcessing}>
              {isProcessing ? "Updating..." : "Save & Notify Players"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
