"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Server, UserCheck } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Effective Date: April 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                1. Data Collection
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Account information (Name, Email, Phone Number).</li>
                <li>KYC documentation (ID proof, address) for payout verification.</li>
                <li>Payment transaction details (processed via Razorpay).</li>
                <li>Game IDs and profiles for tournament participation.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                2. How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>Your data is used to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Verify your identity and prevent fraudulent activities.</li>
                <li>Process tournament registrations and prize payouts.</li>
                <li>Send important notifications regarding match schedules and updates.</li>
                <li>Improve platform performance and user experience.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                3. Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your personal information. Financial transactions are encrypted and processed through secure third-party payment gateways (Razorpay). We never store your full credit card or bank credentials on our servers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                4. Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, update, or request the deletion of your personal data. You can manage most of your information through your profile settings or by contacting our support team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
