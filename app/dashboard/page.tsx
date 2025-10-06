"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  Calendar, 
  Users, 
  DollarSign, 
  Gamepad2, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus
} from "lucide-react"
import { formatDate, formatDateTime } from "@/lib/date-utils"
import Link from "next/link"
import { toast } from "sonner"

interface DashboardStats {
  totalTournaments: number
  activeRegistrations: number
  totalWinnings: number
  upcomingMatches: number
}

interface Tournament {
  id: string
  title: string
  game: string
  entryFee: number
  prizePool: number
  status: string
  registeredAt: string
  startDate: string
  position?: number
  winnings?: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalTournaments: 0,
    activeRegistrations: 0,
    totalWinnings: 0,
    upcomingMatches: 0
  })
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch user stats
      const statsResponse = await fetch("/api/dashboard/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch user tournaments
      const tournamentsResponse = await fetch("/api/dashboard/tournaments")
      if (tournamentsResponse.ok) {
        const tournamentsData = await tournamentsResponse.json()
        setTournaments(tournamentsData)
      }

      // Fetch notifications
      const notificationsResponse = await fetch("/api/dashboard/notifications")
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json()
        setNotifications(notificationsData)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH"
      })
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "ERROR":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-warning" />
      default:
        return <AlertCircle className="h-4 w-4 text-accent" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REGISTRATION_OPEN":
        return <Badge variant="default">Registration Open</Badge>
      case "ONGOING":
        return <Badge variant="secondary">Ongoing</Badge>
      case "COMPLETED":
        return <Badge variant="outline">Completed</Badge>
      case "UPCOMING":
        return <Badge variant="secondary">Upcoming</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user?.name || session.user?.email}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTournaments}</div>
              <p className="text-xs text-muted-foreground">
                Participated in tournaments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRegistrations}</div>
              <p className="text-xs text-muted-foreground">
                Currently registered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalWinnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Prize money earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Matches</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingMatches}</div>
              <p className="text-xs text-muted-foreground">
                Matches scheduled
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tournaments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tournaments">My Tournaments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">My Tournaments</h2>
              <Button asChild>
                <Link href="/tournaments">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Tournaments
                </Link>
              </Button>
            </div>

            {tournaments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tournaments yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    You haven&apos;t registered for any tournaments yet. Start your eSports journey today!
                  </p>
                  <Button asChild>
                    <Link href="/tournaments">Browse Tournaments</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tournaments.map((tournament) => (
                  <Card key={tournament.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{tournament.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Gamepad2 className="h-4 w-4" />
                            {tournament.game}
                          </CardDescription>
                        </div>
                        {getStatusBadge(tournament.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Entry Fee</p>
                          <p className="font-semibold">₹{tournament.entryFee}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Prize Pool</p>
                          <p className="font-semibold">₹{tournament.prizePool.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Start Date</p>
                          <p className="font-semibold">{formatDate(new Date(tournament.startDate))}</p>
                        </div>
                        {tournament.position && (
                          <div>
                            <p className="text-muted-foreground">Position</p>
                            <p className="font-semibold">#{tournament.position}</p>
                          </div>
                        )}
                      </div>
                      {tournament.winnings && tournament.winnings > 0 && (
                        <div className="mt-4 p-3 bg-success/10 rounded-lg">
                          <p className="text-success font-semibold">
                            🎉 You won ₹{tournament.winnings.toLocaleString()}!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <h2 className="text-2xl font-semibold">Notifications</h2>
            
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground text-center">
                    You&apos;re all caught up! Check back later for updates.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`cursor-pointer transition-colors ${
                      !notification.isRead ? "border-primary/50 bg-primary/5" : ""
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(new Date(notification.createdAt))}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quick-actions" className="space-y-6">
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Browse Tournaments</h3>
                      <p className="text-sm text-muted-foreground">Find and join tournaments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">View Leaderboard</h3>
                      <p className="text-sm text-muted-foreground">Check rankings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">View Statistics</h3>
                      <p className="text-sm text-muted-foreground">Track your progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
