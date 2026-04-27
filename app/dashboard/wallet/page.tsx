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
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Banknote,
  Smartphone
} from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: string
  type: "WINNING" | "WITHDRAWAL"
  amount: number
  status: string
  description: string
  date: string
}

interface WalletData {
  balance: number
  totalWinnings: number
  totalWithdrawn: number
  history: Transaction[]
}

export default function WalletPage() {
  const [data, setData] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("UPI")
  const [withdrawDetails, setWithdrawDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchWalletData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/wallet')
      if (response.ok) {
        const walletData = await response.json()
        setData(walletData)
      }
    } catch (error) {
      console.error("Error fetching wallet:", error)
      toast.error("Failed to load wallet data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWalletData()
  }, [])

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount")
      return
    }

    if (amount > (data?.balance || 0)) {
      toast.error("Insufficient balance")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          method: withdrawMethod, 
          details: withdrawDetails 
        })
      })

      if (response.ok) {
        toast.success("Withdrawal request submitted successfully")
        setIsWithdrawOpen(false)
        setWithdrawAmount("")
        setWithdrawDetails("")
        fetchWalletData()
      } else {
        const err = await response.json()
        toast.error(err.error || "Failed to submit request")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !data) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
          <p className="text-muted-foreground">Manage your winnings and withdrawal requests.</p>
        </div>
        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Submit a request to transfer your winnings to your bank account or UPI.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">
                  Available: ₹{data?.balance.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Withdrawal Method</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI (Google Pay, PhonePe, etc.)</SelectItem>
                    <SelectItem value="BANK">Bank Transfer (IMPS/NEFT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">
                  {withdrawMethod === "UPI" ? "UPI ID" : "Bank Account Details (A/C No, IFSC)"}
                </Label>
                <Input 
                  id="details" 
                  placeholder={withdrawMethod === "UPI" ? "example@okaxis" : "1234567890, IFSC0001234"}
                  value={withdrawDetails}
                  onChange={(e) => setWithdrawDetails(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>Cancel</Button>
              <Button onClick={handleWithdraw} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-90">
              <Wallet className="h-4 w-4" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{data?.balance.toLocaleString()}</div>
            <p className="text-xs mt-1 opacity-80">Withdrawable prize money</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <ArrowDownLeft className="h-4 w-4 text-green-500" />
              Total Winnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data?.totalWinnings.toLocaleString()}</div>
            <p className="text-xs mt-1 text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 text-primary" />
              Total Withdrawn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data?.totalWithdrawn.toLocaleString()}</div>
            <p className="text-xs mt-1 text-muted-foreground">Processed payouts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View your recent earnings and withdrawal status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No transactions yet.</TableCell>
                  </TableRow>
                ) : (
                  data?.history.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tx.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tx.type === "WINNING" ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                              Winning
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                              Withdrawal
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {tx.status === "COMPLETED" && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                          {tx.status === "PENDING" && <Clock className="h-3 w-3 text-yellow-500" />}
                          {tx.status === "PROCESSING" && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                          {tx.status === "REJECTED" && <XCircle className="h-3 w-3 text-destructive" />}
                          <span className="text-xs font-medium uppercase tracking-wider">
                            {tx.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-bold ${tx.type === "WINNING" ? "text-green-600" : "text-foreground"}`}>
                        {tx.type === "WINNING" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-muted/30 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Banknote className="h-4 w-4 text-primary" />
              Payment Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <p>• Minimum withdrawal amount is ₹100.</p>
            <p>• Withdrawals are typically processed within 24-48 hours.</p>
            <p>• Ensure your KYC is approved before requesting a payout.</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <p>• We never ask for your UPI PIN or OTP for withdrawals.</p>
            <p>• Payments will only be sent to accounts matching your KYC name.</p>
            <p>• For any issues, contact support immediately.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
