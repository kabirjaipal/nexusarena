"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Users, 
  CreditCard, 
  Gamepad2, 
  TrendingUp,
  DollarSign,
  Calendar,
  Loader2
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalTournaments: number
  totalPayments: number
  totalRevenue: number
  activeTournaments: number
  pendingKYC: number
  recentRegistrations: number
  totalPayouts: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  user?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTournaments: 0,
    totalPayments: 0,
    totalRevenue: 0,
    activeTournaments: 0,
    pendingKYC: 0,
    recentRegistrations: 0,
    totalPayouts: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch admin statistics
        const statsResponse = await fetch('/api/admin/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Fetch recent activity
        const activityResponse = await fetch('/api/admin/activity')
        if (activityResponse.ok) {
          const activityData = await activityResponse.json()
          setRecentActivity(activityData)
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdminStats()
  }, [])

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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your esports platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered players
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTournaments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTournaments} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalPayments} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingKYC}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common admin tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Create Tournament</p>
                    <p className="text-sm text-muted-foreground">Add new tournament</p>
                  </div>
                </div>
                <Badge variant="outline">New</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage Users</p>
                    <p className="text-sm text-muted-foreground">View and edit users</p>
                  </div>
                </div>
                <Badge variant="secondary">{stats.totalUsers}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Process Payouts</p>
                    <p className="text-sm text-muted-foreground">Handle prize distributions</p>
                  </div>
                </div>
                <Badge variant="outline">{stats.totalPayouts}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Schedule Matches</p>
                    <p className="text-sm text-muted-foreground">Manage tournament matches</p>
                  </div>
                </div>
                <Badge variant="secondary">{stats.activeTournaments}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
