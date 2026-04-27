"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2,
  FileText,
  User,
  Calendar
} from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/date-utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface KYCRequest {
  id: string
  userId: string
  fullName: string
  dateOfBirth: string
  idType: string
  idNumber: string
  status: string
  submittedAt: string
  user: {
    name: string
    email: string
  }
}

export default function AdminKYCPage() {
  const [requests, setRequests] = useState<KYCRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/users') // Reusing the users API which includes KYC status
      if (response.ok) {
        const data = await response.json()
        // Filter for those who have submitted KYC but aren't approved yet
        const kycRequests = data
          .filter((u: any) => u.kycStatus === 'PENDING')
          .map((u: any) => ({
            id: u.id,
            userId: u.id,
            fullName: u.name,
            idType: "See Details",
            status: u.kycStatus,
            submittedAt: u.createdAt,
            user: { name: u.name, email: u.email }
          }))
        setRequests(kycRequests)
      }
    } catch (error) {
      console.error("Error fetching KYC requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleAction = async (userId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/admin/users/${userId}/kyc`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason: status === 'REJECTED' ? rejectionReason : undefined })
      })

      if (response.ok) {
        toast.success(`KYC ${status === 'APPROVED' ? 'Approved' : 'Rejected'} successfully`)
        fetchRequests()
        setSelectedRequest(null)
        setRejectionReason("")
      } else {
        toast.error("Failed to update KYC status")
      }
    } catch (error) {
      console.error("Error updating KYC:", error)
      toast.error("An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">KYC Verification Queue</h1>
        <p className="text-muted-foreground mt-2">
          Review and verify player identities to maintain platform integrity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Requests awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>Click on a request to view documents and take action.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                        No pending KYC requests at the moment.
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.userId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded-full">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{request.user.name}</p>
                              <p className="text-xs text-muted-foreground">{request.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(request.submittedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
                            Pending Review
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review KYC: {request.user.name}</DialogTitle>
                                <DialogDescription>
                                  Verify the documents below and approve or reject the request.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                  <h4 className="font-semibold flex items-center gap-2 border-b pb-2">
                                    <FileText className="h-4 w-4" />
                                    Identity Document
                                  </h4>
                                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                                    <p className="text-xs text-muted-foreground text-center px-4">
                                      [ID Document Preview]<br/>
                                      <span className="italic text-[10px]">Actual file would be served from secure storage</span>
                                    </p>
                                  </div>
                                  <Button variant="secondary" size="sm" className="w-full">
                                    View Full Document
                                  </Button>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="font-semibold flex items-center gap-2 border-b pb-2">
                                    <FileText className="h-4 w-4" />
                                    Address Proof
                                  </h4>
                                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                                    <p className="text-xs text-muted-foreground text-center px-4">
                                      [Address Proof Preview]<br/>
                                      <span className="italic text-[10px]">Actual file would be served from secure storage</span>
                                    </p>
                                  </div>
                                  <Button variant="secondary" size="sm" className="w-full">
                                    View Full Document
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <Label htmlFor="reason">Rejection Reason (only if rejecting)</Label>
                                <Textarea 
                                  id="reason"
                                  placeholder="e.g., ID document is blurred, Name mismatch..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                />
                              </div>

                              <DialogFooter className="gap-2 sm:gap-0">
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleAction(request.userId, 'REJECTED')}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? "Processing..." : "Reject KYC"}
                                </Button>
                                <Button 
                                  className="bg-success hover:bg-success/90" 
                                  onClick={() => handleAction(request.userId, 'APPROVED')}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? "Processing..." : "Approve & Verify"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
