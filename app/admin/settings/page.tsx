"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Save,
  Loader2,
  Mail,
  CreditCard,
  Trophy,
  Shield,
  Bell,
  Database,
  Globe
} from "lucide-react"

interface SystemSettings {
  // Platform Settings
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailVerificationRequired: boolean

  // Payment Settings
  minEntryFee: number
  maxEntryFee: number
  platformFeePercentage: number
  minPayoutAmount: number

  // Tournament Settings
  defaultTournamentRules: string
  maxTournamentDuration: number // in hours
  autoStartMatches: boolean
  allowLateRegistrations: boolean

  // Email Settings
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  emailFromAddress: string

  // Notification Settings
  emailNotificationsEnabled: boolean
  pushNotificationsEnabled: boolean
  smsNotificationsEnabled: boolean

  // Security Settings
  sessionTimeout: number // in minutes
  maxLoginAttempts: number
  requireKYCForPayouts: boolean
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    minEntryFee: 10,
    maxEntryFee: 1000,
    platformFeePercentage: 5,
    minPayoutAmount: 50,
    defaultTournamentRules: "1. Be respectful to all players\n2. No cheating or hacking\n3. Follow the tournament schedule\n4. Report issues to admins",
    maxTournamentDuration: 24,
    autoStartMatches: false,
    allowLateRegistrations: false,
    smtpHost: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    emailFromAddress: "",
    emailNotificationsEnabled: true,
    pushNotificationsEnabled: true,
    smsNotificationsEnabled: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    requireKYCForPayouts: true
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/settings')

        if (response.ok) {
          const data = await response.json()
          setSettings({ ...settings, ...data })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure platform settings and preferences
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="platform" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Platform Settings
              </CardTitle>
              <CardDescription>
                Configure general platform behavior and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable maintenance mode to prevent user access
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Registration Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register on the platform
                  </p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, registrationEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Verification Required</Label>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new registrations
                  </p>
                </div>
                <Switch
                  checked={settings.emailVerificationRequired}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailVerificationRequired: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure payment limits and fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minEntryFee">Minimum Entry Fee (₹)</Label>
                  <Input
                    id="minEntryFee"
                    type="number"
                    value={settings.minEntryFee}
                    onChange={(e) =>
                      setSettings({ ...settings, minEntryFee: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxEntryFee">Maximum Entry Fee (₹)</Label>
                  <Input
                    id="maxEntryFee"
                    type="number"
                    value={settings.maxEntryFee}
                    onChange={(e) =>
                      setSettings({ ...settings, maxEntryFee: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformFeePercentage">Platform Fee (%)</Label>
                  <Input
                    id="platformFeePercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.platformFeePercentage}
                    onChange={(e) =>
                      setSettings({ ...settings, platformFeePercentage: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPayoutAmount">Minimum Payout Amount (₹)</Label>
                  <Input
                    id="minPayoutAmount"
                    type="number"
                    value={settings.minPayoutAmount}
                    onChange={(e) =>
                      setSettings({ ...settings, minPayoutAmount: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tournaments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Tournament Settings
              </CardTitle>
              <CardDescription>
                Configure tournament defaults and rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultRules">Default Tournament Rules</Label>
                <Textarea
                  id="defaultRules"
                  value={settings.defaultTournamentRules}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultTournamentRules: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDuration">Max Tournament Duration (hours)</Label>
                  <Input
                    id="maxDuration"
                    type="number"
                    value={settings.maxTournamentDuration}
                    onChange={(e) =>
                      setSettings({ ...settings, maxTournamentDuration: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex items-center justify-between col-span-2">
                  <div className="space-y-0.5">
                    <Label>Auto-start Matches</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically start matches when scheduled
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoStartMatches}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoStartMatches: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Late Registrations</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to register after tournament starts
                  </p>
                </div>
                <Switch
                  checked={settings.allowLateRegistrations}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, allowLateRegistrations: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) =>
                      setSettings({ ...settings, smtpHost: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) =>
                      setSettings({ ...settings, smtpPort: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={(e) =>
                      setSettings({ ...settings, smtpUsername: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) =>
                      setSettings({ ...settings, smtpPassword: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailFromAddress">From Email Address</Label>
                <Input
                  id="emailFromAddress"
                  type="email"
                  value={settings.emailFromAddress}
                  onChange={(e) =>
                    setSettings({ ...settings, emailFromAddress: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for important events
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotificationsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotificationsEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send browser push notifications
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotificationsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, pushNotificationsEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send SMS notifications (requires SMS service)
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotificationsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, smsNotificationsEnabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings({ ...settings, sessionTimeout: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.maxLoginAttempts}
                    onChange={(e) =>
                      setSettings({ ...settings, maxLoginAttempts: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require KYC for Payouts</Label>
                  <p className="text-sm text-muted-foreground">
                    Require KYC verification before processing payouts
                  </p>
                </div>
                <Switch
                  checked={settings.requireKYCForPayouts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, requireKYCForPayouts: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
