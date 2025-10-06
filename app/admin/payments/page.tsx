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
  CreditCard,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  IndianRupee,
  Users,
  TrendingUp,
  DollarSign
} from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  method: string
  description: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  tournament?: {
    id: string
    title: string
  }
}

interface Payout {
  id: string
  amount: number
  position: number
  status: string
  createdAt: string
  processedAt: string | null
  user: {
    id: string
    name: string
    email: string
  }
  tournament: {
    id: string
    title: string
  }
}

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return <Badge variant="default">Success</Badge>
    case 'PENDING':
      return <Badge variant="secondary">Pending</Badge>
    case 'FAILED':
      return <Badge variant="destructive">Failed</Badge>
    case 'REFUNDED':
      return <Badge variant="outline">Refunded</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getPayoutStatusBadge = (status: string) => {
  switch (status) {
    case 'PROCESSED':
      return <Badge variant="default">Processed</Badge>
    case 'PENDING':
      return <Badge variant="secondary">Pending</Badge>
    case 'FAILED':
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'payments' | 'payouts'>('payments')
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchPaymentsAndPayouts = async () => {
      try {
        setIsLoading(true)

        // Fetch payments
        const paymentsResponse = await fetch('/api/admin/payments')
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json()
          setPayments(paymentsData)
          setFilteredPayments(paymentsData)
        }

        // Fetch payouts
        const payoutsResponse = await fetch('/api/admin/payouts')
        if (payoutsResponse.ok) {
          const payoutsData = await payoutsResponse.json()
          setPayouts(payoutsData)
          setFilteredPayouts(payoutsData)
        }
      } catch (error) {
        console.error('Error fetching payments and payouts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentsAndPayouts()
  }, [])

  useEffect(() => {
    // Filter payments
    let filteredPayments = payments

    if (searchTerm) {
      filteredPayments = filteredPayments.filter(payment =>
        payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.tournament?.title.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filteredPayments = filteredPayments.filter(payment => payment.status === statusFilter)
    }

    setFilteredPayments(filteredPayments)

    // Filter payouts
    let filteredPayouts = payouts

    if (searchTerm) {
      filteredPayouts = filteredPayouts.filter(payout =>
        payout.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payout.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payout.tournament.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filteredPayouts = filteredPayouts.filter(payout => payout.status === statusFilter)
    }

    setFilteredPayouts(filteredPayouts)
  }, [payments, payouts, searchTerm, statusFilter])

  const handleProcessPayout = async (payoutId: string) => {
    if (!confirm('Are you sure you want to process this payout?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}/process`, {
        method: 'POST'
      })

      if (response.ok) {
        setPayouts(payouts.map(payout =>
          payout.id === payoutId
            ? { ...payout, status: 'PROCESSED', processedAt: new Date().toISOString() }
            : payout
        ))
        setFilteredPayouts(filteredPayouts.map(payout =>
          payout.id === payoutId
            ? { ...payout, status: 'PROCESSED', processedAt: new Date().toISOString() }
            : payout
        ))
      } else {
        alert('Failed to process payout')
      }
    } catch (error) {
      console.error('Error processing payout:', error)
      alert('Failed to process payout')
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
        <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage payments and payouts for tournaments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === 'SUCCESS').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payouts.filter(p => p.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'payments' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </Button>
            <Button
              variant={activeTab === 'payouts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('payouts')}
            >
              Payouts
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={`Search ${activeTab}...`}
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
              {activeTab === 'payments' ? (
                <>
                  <option value="SUCCESS">Success</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </>
              ) : (
                <>
                  <option value="PROCESSED">Processed</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </>
              )}
            </select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTab === 'payments' ? (
                  filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {payment.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {payment.tournament ? (
                            <div className="font-medium">{payment.tournament.title}</div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹{Number(payment.amount).toLocaleString()}
                          </div>
                          {payment.method && (
                            <div className="text-sm text-muted-foreground">
                              {payment.method}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(payment.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                ) : (
                  filteredPayouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No payouts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payout.user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {payout.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payout.tournament.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Position: {payout.position}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹{Number(payout.amount).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPayoutStatusBadge(payout.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(payout.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {payout.status === 'PENDING' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleProcessPayout(payout.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
