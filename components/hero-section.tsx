"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Trophy, Users, Zap, Shield, Star } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Shield className="w-3 h-3 mr-1" />
                Legal & Compliant Gaming
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Compete in{" "}
                <span className="text-primary">Epic</span>{" "}
                eSports Tournaments
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Join India&apos;s premier eSports platform for PUBG, Free Fire, and more. 
                Compete for real prizes in legal, regulated tournaments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/tournaments">
                  <Trophy className="w-4 h-4 mr-2" />
                  Browse Tournaments
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">₹50K+</div>
                <div className="text-sm text-muted-foreground">Prize Pool</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold">PUBG Mobile</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Entry Fee</span>
                      <span className="font-semibold">₹100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Prize Pool</span>
                      <span className="font-semibold">₹5,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Players</span>
                      <span className="font-semibold">50/100</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </CardContent>
              </Card>

              <Card className="p-6 mt-8">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="font-semibold">Free Fire</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Entry Fee</span>
                      <span className="font-semibold">₹50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Prize Pool</span>
                      <span className="font-semibold">₹2,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Players</span>
                      <span className="font-semibold">25/50</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    <Users className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
