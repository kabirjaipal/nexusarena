"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  User,
  MapPin,
  CreditCard
} from "lucide-react"
import { toast } from "sonner"

interface KYCData {
  id: string
  fullName: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  pincode: string
  idType: string
  idNumber: string
  status: string
  submittedAt: string
  verifiedAt: string | null
}

export default function KYCPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [kycData, setKycData] = useState<KYCData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    idType: "",
    idNumber: "",
    idDocument: null as File | null,
    addressProof: null as File | null
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchKYCData()
    }
  }, [status, router])

  const fetchKYCData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/profile/kyc")
      if (response.ok) {
        const data = await response.json()
        setKycData(data)
        if (data) {
          setFormData({
            fullName: data.fullName,
            dateOfBirth: data.dateOfBirth.split('T')[0], // Convert to YYYY-MM-DD format
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            idType: data.idType,
            idNumber: data.idNumber,
            idDocument: null,
            addressProof: null
          })
        }
      }
    } catch (error) {
      console.error("Error fetching KYC data:", error)
      toast.error("Failed to load KYC data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idDocument' | 'addressProof') => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and PDF files are allowed")
        return
      }
      
      setFormData(prev => ({ ...prev, [field]: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validation
    if (!formData.fullName || !formData.dateOfBirth || !formData.address || 
        !formData.city || !formData.state || !formData.pincode || 
        !formData.idType || !formData.idNumber) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    if (!formData.idDocument || !formData.addressProof) {
      setError("Please upload both ID document and address proof")
      setIsSubmitting(false)
      return
    }

    // Validate age (must be 18+)
    const birthDate = new Date(formData.dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 18) {
      setError("You must be at least 18 years old to complete KYC")
      setIsSubmitting(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("fullName", formData.fullName)
      formDataToSend.append("dateOfBirth", formData.dateOfBirth)
      formDataToSend.append("address", formData.address)
      formDataToSend.append("city", formData.city)
      formDataToSend.append("state", formData.state)
      formDataToSend.append("pincode", formData.pincode)
      formDataToSend.append("idType", formData.idType)
      formDataToSend.append("idNumber", formData.idNumber)
      formDataToSend.append("idDocument", formData.idDocument)
      formDataToSend.append("addressProof", formData.addressProof)

      const response = await fetch("/api/profile/kyc", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit KYC")
      }

      toast.success("KYC submitted successfully! We'll review it and notify you.")
      fetchKYCData() // Refresh KYC data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="default" className="bg-success">Verified</Badge>
      case "PENDING":
        return <Badge variant="secondary">Under Review</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Not Submitted</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "PENDING":
        return <AlertCircle className="h-5 w-5 text-warning" />
      case "REJECTED":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
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

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">KYC Verification</h1>
            <p className="text-muted-foreground">
              Complete your Know Your Customer verification to participate in tournaments
            </p>
          </div>

          {/* KYC Status */}
          {kycData && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  KYC Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  {getStatusIcon(kycData.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold">Verification Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {kycData.status === "APPROVED" 
                        ? "Your identity has been verified successfully"
                        : kycData.status === "PENDING"
                        ? "Your KYC is under review. We'll notify you once it's processed."
                        : kycData.status === "REJECTED"
                        ? "Your KYC was rejected. Please update your information and resubmit."
                        : "KYC verification is required to participate in tournaments"
                      }
                    </p>
                  </div>
                  {getStatusBadge(kycData.status)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* KYC Form */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide accurate information for identity verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name as per ID"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter pincode"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ID Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Identity Document
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Type *</Label>
                      <Select value={formData.idType} onValueChange={(value) => handleSelectChange("idType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AADHAR">Aadhar Card</SelectItem>
                          <SelectItem value="PAN">PAN Card</SelectItem>
                          <SelectItem value="PASSPORT">Passport</SelectItem>
                          <SelectItem value="DRIVING_LICENSE">Driving License</SelectItem>
                          <SelectItem value="VOTER_ID">Voter ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number *</Label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        placeholder="Enter ID number"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Document Upload
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idDocument">ID Document *</Label>
                      <Input
                        id="idDocument"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileChange(e, "idDocument")}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload clear photo/scan of your ID document (Max 5MB)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressProof">Address Proof *</Label>
                      <Input
                        id="addressProof"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileChange(e, "addressProof")}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload address proof document (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || (kycData?.status === "PENDING")}
                  >
                    {isSubmitting ? "Submitting..." : kycData ? "Update KYC" : "Submit KYC"}
                  </Button>
                  
                  {kycData?.status === "PENDING" && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Your KYC is under review. You cannot make changes at this time.
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
