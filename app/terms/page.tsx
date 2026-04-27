"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, FileText, Scale } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: April 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Nexus Arena, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our platform. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of those changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                2. User Conduct & Fair Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Nexus Arena maintains a zero-tolerance policy towards cheating, hacking, or any form of unsportsmanlike conduct. Users found using third-party software to gain an unfair advantage will be permanently banned, and any winnings will be forfeited.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                3. Payments & Withdrawals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                - Registration fees are non-refundable once a tournament bracket has been generated.
              </p>
              <p>
                - Winnings are credited to your virtual wallet and can be withdrawn via UPI or Bank Transfer.
              </p>
              <p>
                - Withdrawals are processed within 24-48 business hours after a successful request.
              </p>
              <p>
                - Users must complete KYC verification to be eligible for prize withdrawals.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                4. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Nexus Arena is not responsible for technical issues, internet connectivity problems, or game-specific bugs that may affect tournament outcomes. Matches will be decided based on official game results and admin discretion.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
