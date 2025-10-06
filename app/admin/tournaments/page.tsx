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
  Trophy, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Users,
  DollarSign,
  Loader2
} from "lucide-react"
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
  minPlayers: number
  currentPlayers: number
  startDate: string
  endDate: string
  registrationStart: string
  registrationEnd: string
  status: string
  isActive: boolean
  createdAt: string
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'UPCOMING':
      return <Badge variant="outline">Upcoming</Badge>
    case 'REGISTRATION_OPEN':
      return <Badge variant="default">Registration Open</Badge>
    case 'REGISTRATION_CLOSED':
      return <Badge variant="secondary">Registration Closed</Badge>
    case 'ONGOING':
      return <Badge variant="destructive">Ongoing</Badge>
    case 'COMPLETED':
      return <Badge variant="outline">Completed</Badge>
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

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/tournaments')
        
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments')
        }
        
        const data = await response.json()
        setTournaments(data)
        setFilteredTournaments(data)
      } catch (error) {
        console.error('Error fetching tournaments:', error)
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
        tournament.game.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(tournament => tournament.status === statusFilter)
    }

    setFilteredTournaments(filtered)
  }, [tournaments, searchTerm, statusFilter])

  const handleDeleteTournament = async (tournamentId: string) => {
    if (!confirm('Are you sure you want to delete this tournament?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/tournaments/${tournamentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTournaments(tournaments.filter(t => t.id !== tournamentId))
        setFilteredTournaments(filteredTournaments.filter(t => t.id !== tournamentId))
      } else {
        alert('Failed to delete tournament')
      }
    } catch (error) {
      console.error('Error deleting tournament:', error)
      alert('Failed to delete tournament')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tournament Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all tournaments on the platform
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tournaments/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Tournament
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournaments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tournaments.filter(t => t.status === 'ONGOING').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registration Open</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tournaments.filter(t => t.status === 'REGISTRATION_OPEN').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prize Pool</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{tournaments.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tournaments</CardTitle>
          <CardDescription>
            Search and filter tournaments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tournaments..."
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
              <option value="UPCOMING">Upcoming</option>
              <option value="REGISTRATION_OPEN">Registration Open</option>
              <option value="REGISTRATION_CLOSED">Registration Closed</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Tournaments Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No tournaments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTournaments.map((tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tournament.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Entry: ₹{tournament.entryFee}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{getGameIcon(tournament.game)}</span>
                          <span>{tournament.game}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tournament.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {tournament.currentPlayers}/{tournament.maxPlayers}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ₹{tournament.prizePool.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(tournament.startDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/tournaments/${tournament.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/tournaments/${tournament.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTournament(tournament.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
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
    </div>
  )
}
