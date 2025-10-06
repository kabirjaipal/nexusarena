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
  Users, 
  Search, 
  Eye, 
  Shield,
  Mail,
  Phone,
  Calendar,
  Loader2,
  UserCheck,
  UserX
} from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  phone: string
  age: number
  role: string
  isVerified: boolean
  emailVerified: string | null
  createdAt: string
  kycStatus?: string
  totalRegistrations: number
  totalWinnings: number
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return <Badge variant="destructive">Super Admin</Badge>
    case 'ADMIN':
      return <Badge variant="default">Admin</Badge>
    case 'USER':
      return <Badge variant="secondary">User</Badge>
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

const getKYCStatusBadge = (status?: string) => {
  switch (status) {
    case 'APPROVED':
      return <Badge variant="default">Approved</Badge>
    case 'PENDING':
      return <Badge variant="secondary">Pending</Badge>
    case 'REJECTED':
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return <Badge variant="outline">Not Submitted</Badge>
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [kycFilter, setKycFilter] = useState("all")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/users')
        
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Filter by KYC status
    if (kycFilter !== "all") {
      if (kycFilter === "none") {
        filtered = filtered.filter(user => !user.kycStatus)
      } else {
        filtered = filtered.filter(user => user.kycStatus === kycFilter)
      }
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, kycFilter])

  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified: !currentStatus }),
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isVerified: !currentStatus }
            : user
        ))
        setFilteredUsers(filteredUsers.map(user => 
          user.id === userId 
            ? { ...user, isVerified: !currentStatus }
            : user
        ))
      } else {
        alert('Failed to update user verification status')
      }
    } catch (error) {
      console.error('Error updating user verification:', error)
      alert('Failed to update user verification status')
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all users on the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.isVerified).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Approved</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.kycStatus === 'APPROVED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'USER').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Search and filter users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="USER">Users</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPER_ADMIN">Super Admins</option>
            </select>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All KYC Status</option>
              <option value="none">No KYC</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getKYCStatusBadge(user.kycStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user.isVerified ? (
                            <Badge variant="default">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Unverified</Badge>
                          )}
                          {user.role === 'USER' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleVerification(user.id, user.isVerified)}
                            >
                              {user.isVerified ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.totalRegistrations} tournaments
                        </div>
                        {user.totalWinnings > 0 && (
                          <div className="text-xs text-muted-foreground">
                            ₹{user.totalWinnings.toLocaleString()} won
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              <Eye className="h-4 w-4" />
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
    </div>
  )
}
