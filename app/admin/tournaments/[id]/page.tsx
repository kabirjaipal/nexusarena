"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Users, 
  Calendar, 
  ArrowLeft, 
  Loader2, 
  Settings, 
  UserCheck, 
  UserX,
  PlayCircle,
  GitBranch,
  ShieldAlert
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { formatDate, formatDateTime } from "@/lib/date-utils"

interface Tournament {
  id: string
  title: string
  game: string
  status: string
  entryFee: number
  prizePool: number
  maxPlayers: number
  currentPlayers: number
  registrations: Array<{
    id: string
    userId: string
    userName: string
    status: string
    registeredAt: string
  }>
  matches: any[]
}

export default function AdminTournamentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchTournament = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/tournaments/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTournament(data)
      } else {
        toast.error("Failed to load tournament")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTournament()
  }, [params.id])

  const handleGenerateBracket = async () => {
    if (!confirm("Are you sure? This will generate matches for all confirmed players and start the tournament.")) return

    try {
      setIsGenerating(true)
      const response = await fetch(`/api/admin/tournaments/${params.id}/bracket`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success("Bracket generated successfully!")
        fetchTournament()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to generate bracket")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!tournament) return <div>Tournament not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{tournament.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Badge variant="outline">{tournament.game}</Badge>
              {tournament.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {tournament.matches.length === 0 && tournament.status === "REGISTRATION_CLOSED" && (
            <Button onClick={handleGenerateBracket} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch className="h-4 w-4 mr-2" />}
              Generate Bracket
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/admin/tournaments/${tournament.id}/edit`}>
              <Settings className="h-4 w-4 mr-2" /> Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournament.currentPlayers} / {tournament.maxPlayers}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prize Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{tournament.prizePool.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total rewards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Match Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournament.matches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Matches generated</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>Manage players registered for this tournament.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
             <table className="w-full text-sm">
                <thead>
                   <tr className="bg-muted/50 border-b">
                      <th className="p-3 text-left">Player</th>
                      <th className="p-3 text-left">Registered At</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody>
                   {tournament.registrations.map((reg) => (
                      <tr key={reg.id} className="border-b last:border-0">
                         <td className="p-3 font-medium">{reg.userName}</td>
                         <td className="p-3 text-muted-foreground">{formatDate(reg.registeredAt)}</td>
                         <td className="p-3">
                            <Badge variant={reg.status === "CONFIRMED" ? "default" : "secondary"}>
                               {reg.status}
                            </Badge>
                         </td>
                         <td className="p-3 text-right">
                            <Button variant="ghost" size="sm">
                               <ShieldAlert className="h-4 w-4 text-destructive" />
                            </Button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
