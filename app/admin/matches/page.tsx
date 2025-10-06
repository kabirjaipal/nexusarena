"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Pause,
  Calendar,
  Trophy,
  Users,
  Clock,
  Loader2,
  Plus,
  Edit
} from "lucide-react"
import { formatDate, formatDateTime } from "@/lib/date-utils"
import Link from "next/link"

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
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return <Badge variant="outline">Scheduled</Badge>
    case 'ONGOING':
      return <Badge variant="default">Ongoing</Badge>
    case 'COMPLETED':
      return <Badge variant="secondary">Completed</Badge>
    case 'CANCELLED':
      return <Badge variant="destructive">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getGameIcon = (game: string) => {
  switch (game) {
    case 'FREE_FIRE':
      return '🔥'
    case 'PUBG':
      return '🎯'
    case 'BGMI':
      return '📱'
    case 'VALORANT':
      return '⚔️'
    case 'CS2':
      return '🔫'
    default:
      return '🎮'
  }
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tournamentFilter, setTournamentFilter] = useState("all")

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/matches')

        if (!response.ok) {
          throw new Error('Failed to fetch matches')
        }

        const data = await response.json()
        setMatches(data)
        setFilteredMatches(data)
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [])

  useEffect(() => {
    let filtered = matches

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(match =>
        match.tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.player1?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.player2?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.winner?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(match => match.status === statusFilter)
    }

    // Filter by tournament
    if (tournamentFilter !== "all") {
      filtered = filtered.filter(match => match.tournament.id === tournamentFilter)
    }

    setFilteredMatches(filtered)
  }, [matches, searchTerm, statusFilter, tournamentFilter])

  const handleStartMatch = async (matchId: string) => {
    try {
      const response = await fetch(`/api/admin/matches/${matchId}/start`, {
        method: 'POST'
      })

      if (response.ok) {
        setMatches(matches.map(match =>
          match.id === matchId
            ? { ...match, status: 'ONGOING', startedAt: new Date().toISOString() }
            : match
        ))
        setFilteredMatches(filteredMatches.map(match =>
          match.id === matchId
            ? { ...match, status: 'ONGOING', startedAt: new Date().toISOString() }
            : match
        ))
      } else {
        alert('Failed to start match')
      }
    } catch (error) {
      console.error('Error starting match:', error)
      alert('Failed to start match')
    }
  }

  const handleEndMatch = async (matchId: string, winnerId: string) => {
    try {
      const response = await fetch(`/api/admin/matches/${matchId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winnerId })
      })

      if (response.ok) {
        setMatches(matches.map(match =>
          match.id === matchId
            ? { ...match, status: 'COMPLETED', endedAt: new Date().toISOString(), winner: matches.find(m => m.id === matchId)?.player1?.id === winnerId ? match.player1 : match.player2 }
            : match
        ))
        setFilteredMatches(filteredMatches.map(match =>
          match.id === matchId
            ? { ...match, status: 'COMPLETED', endedAt: new Date().toISOString(), winner: filteredMatches.find(m => m.id === matchId)?.player1?.id === winnerId ? match.player1 : match.player2 }
            : match
        ))
      } else {
        alert('Failed to end match')
      }
    } catch (error) {
      console.error('Error ending match:', error)
      alert('Failed to end match')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Get unique tournaments for filter
  const tournaments = Array.from(new Set(matches.map(match => match.tournament.id))).map(id => {
    const match = matches.find(m => m.tournament.id === id)
    return { id: match!.tournament.id, title: match!.tournament.title }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Match Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage tournament matches and results
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/matches/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Match
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {matches.filter(m => m.status === 'SCHEDULED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {matches.filter(m => m.status === 'ONGOING').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {matches.filter(m => m.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Matches</CardTitle>
          <CardDescription>
            Search and filter matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search matches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              value={tournamentFilter}
              onChange={(e) => setTournamentFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Tournaments</option>
              {tournaments.map(tournament => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.title}
                </option>
              ))}
            </select>
          </div>

          {/* Matches Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No matches found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            Round {match.round} - Match {match.matchNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {match.id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{getGameIcon(match.tournament.game)}</span>
                          <div>
                            <div className="font-medium">{match.tournament.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {match.tournament.game}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {match.player1 ? (
                            <div className="text-sm">
                              <span className="font-medium">{match.player1.name}</span>
                              {match.winner?.id === match.player1.id && (
                                <Badge variant="default" className="ml-2 text-xs">Winner</Badge>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">TBD</div>
                          )}
                          <div className="text-xs text-muted-foreground">vs</div>
                          {match.player2 ? (
                            <div className="text-sm">
                              <span className="font-medium">{match.player2.name}</span>
                              {match.winner?.id === match.player2.id && (
                                <Badge variant="default" className="ml-2 text-xs">Winner</Badge>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">TBD</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(match.status)}
                      </TableCell>
                      <TableCell>
                        {match.scheduledAt ? (
                          <div className="text-sm">
                            {formatDateTime(match.scheduledAt)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not scheduled</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {match.winner ? (
                          <div className="text-sm font-medium">
                            {match.winner.name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">TBD</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/matches/${match.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {match.status === 'SCHEDULED' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartMatch(match.id)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {match.status === 'ONGOING' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const winnerId = prompt('Enter winner ID (player1 or player2):')
                                if (winnerId) handleEndMatch(match.id, winnerId)
                              }}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
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
    </div>
  )
}
