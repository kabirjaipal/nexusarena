"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X,
  Camera,
  Lock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string
  email: string
  emailVerified: string | null
  phone: string
  age: number
  image: string
  isVerified: boolean
  role: string
  createdAt: string
}

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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [kycData, setKycData] = useState<KYCData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    age: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchProfileData()
    }
  }, [status, router])

  const fetchProfileData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch user profile
      const profileResponse = await fetch("/api/profile")
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData)
        setEditForm({
          name: profileData.name || "",
          phone: profileData.phone || "",
          age: profileData.age?.toString() || ""
        })
      }

      // Fetch KYC data
      const kycResponse = await fetch("/api/profile/kyc")
      if (kycResponse.ok) {
        const kycData = await kycResponse.json()
        setKycData(kycData)
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
      toast.error("Failed to load profile data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      
      // Filter out empty strings and prepare data
      const formData = {
        name: editForm.name.trim() || undefined,
        phone: editForm.phone.trim() || undefined,
        age: editForm.age.trim() || undefined,
      }
      
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
      age: profile?.age?.toString() || ""
    })
    setIsEditing(false)
  }

  const getKYCStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="default" className="bg-green-500">Verified</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pending Review</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Not Submitted</Badge>
    }
  }

  const getKYCStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "PENDING":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "REJECTED":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and settings
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and profile information
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.image || ""} alt={profile.name || ""} />
                    <AvatarFallback className="text-lg">
                      {profile.name?.charAt(0) || profile.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{profile.name || "No name set"}</h3>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.name || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                      <div className="ml-auto flex items-center gap-2">
                        {profile.emailVerified ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                        <Badge variant="outline">Primary</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91-9876543210"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.phone || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        value={editForm.age}
                        onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="18"
                        min="18"
                        max="100"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.age || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Account Status</Label>
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{profile.role.toLowerCase()}</span>
                      {profile.isVerified && (
                        <Badge variant="default" className="bg-green-500 ml-auto">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>KYC Verification</CardTitle>
                    <CardDescription>
                      Complete your Know Your Customer verification for tournament participation
                    </CardDescription>
                  </div>
                  {(!kycData || kycData.status === "REJECTED") && (
                    <Button asChild>
                      <a href="/kyc">
                        {kycData ? "Update KYC" : "Complete KYC"}
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {kycData ? (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      {getKYCStatusIcon(kycData.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold">KYC Status</h3>
                        <p className="text-sm text-muted-foreground">
                          {kycData.status === "APPROVED" 
                            ? "Your identity has been verified successfully"
                            : kycData.status === "PENDING"
                            ? "Your KYC is under review. We'll notify you once it's processed."
                            : "Your KYC was rejected. Please update your information and resubmit."
                          }
                        </p>
                      </div>
                      {getKYCStatusBadge(kycData.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Full Name</Label>
                        <p className="text-sm text-muted-foreground">{kycData.fullName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Date of Birth</Label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(kycData.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">ID Type</Label>
                        <p className="text-sm text-muted-foreground">{kycData.idType}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">ID Number</Label>
                        <p className="text-sm text-muted-foreground">
                          {kycData.idNumber.replace(/(.{4})(.*)(.{4})/, "$1****$3")}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium">Address</Label>
                        <p className="text-sm text-muted-foreground">
                          {kycData.address}, {kycData.city}, {kycData.state} - {kycData.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Submitted: {new Date(kycData.submittedAt).toLocaleString()}</p>
                      {kycData.verifiedAt && (
                        <p>Verified: {new Date(kycData.verifiedAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">KYC Not Completed</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete your KYC verification to participate in tournaments and receive payouts.
                    </p>
                    <Button asChild>
                      <a href="/kyc">Complete KYC Verification</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Last updated: Never (or show last update date)
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/profile/change-password">Change Password</a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
