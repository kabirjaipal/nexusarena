import Link from "next/link"
import { Gamepad2, Mail, Phone, MapPin, Shield, FileText, Users } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Jaipal Esports</span>
            </div>
            <p className="text-sm text-muted-foreground">
              India&apos;s premier eSports platform for legal, regulated gaming tournaments.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span>18+ Only • Legal Gaming</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Tournaments</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tournaments" className="text-muted-foreground hover:text-foreground">
                  All Tournaments
                </Link>
              </li>
              <li>
                <Link href="/tournaments/pubg" className="text-muted-foreground hover:text-foreground">
                  PUBG Mobile
                </Link>
              </li>
              <li>
                <Link href="/tournaments/free-fire" className="text-muted-foreground hover:text-foreground">
                  Free Fire
                </Link>
              </li>
              <li>
                <Link href="/tournaments/bgmi" className="text-muted-foreground hover:text-foreground">
                  BGMI
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/discord" className="text-muted-foreground hover:text-foreground">
                  Discord Community
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground">
                  Legal Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/responsible-gaming" className="text-muted-foreground hover:text-foreground">
                  Responsible Gaming
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Jaipal Esports. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>India</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>support@jaipalesports.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
