"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CreateTournamentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    game: "",
    entryFee: "",
    prizePool: "",
    maxPlayers: "",
    minPlayers: "",
    startDate: "",
    endDate: "",
    registrationStart: "",
    registrationEnd: "",
    status: "UPCOMING",
    rules: "",
    banner: "",
    isActive: true,
    isFeatured: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.game || !formData.entryFee || !formData.prizePool) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/admin/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          entryFee: parseFloat(formData.entryFee),
          prizePool: parseFloat(formData.prizePool),
          maxPlayers: parseInt(formData.maxPlayers) || 100,
          minPlayers: parseInt(formData.minPlayers) || 2
        }),
      })

      if (response.ok) {
        toast.success("Tournament created successfully!")
        router.push('/admin/tournaments')
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create tournament")
      }
    } catch (error) {
      console.error('Error creating tournament:', error)
      toast.error("Failed to create tournament")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/tournaments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tournaments
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Tournament</h1>
          <p className="text-muted-foreground">
            Add a new tournament to the platform
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Tournament details and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tournament Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., PUBG Mobile Championship 2024"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tournament description and details..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="game">Game *</Label>
                <Select value={formData.game} onValueChange={(value) => handleSelectChange('game', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBG">PUBG Mobile</SelectItem>
                    <SelectItem value="FREE_FIRE">Free Fire</SelectItem>
                    <SelectItem value="BGMI">BGMI</SelectItem>
                    <SelectItem value="VALORANT">Valorant</SelectItem>
                    <SelectItem value="CS2">Counter-Strike 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="banner">Banner URL</Label>
                <Input
                  id="banner"
                  name="banner"
                  value={formData.banner}
                  onChange={handleInputChange}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tournament Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Tournament Settings</CardTitle>
              <CardDescription>
                Entry fees, prize pool, and player limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entryFee">Entry Fee (₹) *</Label>
                  <Input
                    id="entryFee"
                    name="entryFee"
                    type="number"
                    value={formData.entryFee}
                    onChange={handleInputChange}
                    placeholder="100"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prizePool">Prize Pool (₹) *</Label>
                  <Input
                    id="prizePool"
                    name="prizePool"
                    type="number"
                    value={formData.prizePool}
                    onChange={handleInputChange}
                    placeholder="10000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPlayers">Min Players</Label>
                  <Input
                    id="minPlayers"
                    name="minPlayers"
                    type="number"
                    value={formData.minPlayers}
                    onChange={handleInputChange}
                    placeholder="2"
                    min="2"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPlayers">Max Players</Label>
                  <Input
                    id="maxPlayers"
                    name="maxPlayers"
                    type="number"
                    value={formData.maxPlayers}
                    onChange={handleInputChange}
                    placeholder="100"
                    min="2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                    <SelectItem value="REGISTRATION_OPEN">Registration Open</SelectItem>
                    <SelectItem value="REGISTRATION_CLOSED">Registration Closed</SelectItem>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleCheckboxChange('isActive', checked as boolean)}
                  />
                  <Label htmlFor="isActive">Active Tournament</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleCheckboxChange('isFeatured', checked as boolean)}
                  />
                  <Label htmlFor="isFeatured">Featured Tournament</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Tournament Schedule</CardTitle>
            <CardDescription>
              Set registration and tournament dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registrationStart">Registration Start</Label>
                <Input
                  id="registrationStart"
                  name="registrationStart"
                  type="datetime-local"
                  value={formData.registrationStart}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="registrationEnd">Registration End</Label>
                <Input
                  id="registrationEnd"
                  name="registrationEnd"
                  type="datetime-local"
                  value={formData.registrationEnd}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="startDate">Tournament Start</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Tournament End</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Tournament Rules</CardTitle>
            <CardDescription>
              Rules and regulations for the tournament
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="rules">Rules</Label>
              <Textarea
                id="rules"
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                placeholder="Enter tournament rules and regulations..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin/tournaments">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Tournament
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
