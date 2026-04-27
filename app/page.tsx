import { HeroSection } from "@/components/hero-section";
import { FeaturedTournaments } from "@/components/featured-tournaments";
import { 
  Trophy, 
  Users, 
  Gamepad2, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-primary-foreground/80 text-sm uppercase tracking-wider">Tournaments</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">₹10L+</div>
              <div className="text-primary-foreground/80 text-sm uppercase tracking-wider">Prizes Won</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">50K+</div>
              <div className="text-primary-foreground/80 text-sm uppercase tracking-wider">Active Players</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-primary-foreground/80 text-sm uppercase tracking-wider">Support</div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedTournaments />

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Become a professional eSports player in 4 simple steps.
          </p>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Register", desc: "Create your account and complete KYC verification." },
              { icon: Gamepad2, title: "Join", desc: "Select a tournament and pay the entry fee." },
              { icon: Trophy, title: "Compete", desc: "Play your matches and climb the leaderboard." },
              { icon: Zap, title: "Withdraw", desc: "Get your winnings directly into your bank account." }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <Card className="border-none bg-transparent text-center">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
                {i < 3 && (
                  <ArrowRight className="hidden lg:block absolute top-12 -right-4 w-8 h-8 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-muted p-8 md:p-16 rounded-[2.5rem] relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  100% Safe & Legal
                </div>
                <h2 className="text-4xl font-bold leading-tight">Built for Players, <br />Powered by Trust.</h2>
                <p className="text-muted-foreground">
                  Jaipal Esports uses state-of-the-art security to ensure every tournament is fair, every payment is secure, and every withdrawal is fast.
                </p>
                <div className="flex gap-4 pt-4">
                  <Button size="lg" asChild>
                    <Link href="/tournaments">Play Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-background/50 backdrop-blur border-none">
                  <CardContent className="p-6">
                    <TrendingUp className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">Live Brackets</h3>
                    <p className="text-xs text-muted-foreground">Real-time match updates and results tracking.</p>
                  </CardContent>
                </Card>
                <Card className="bg-background/50 backdrop-blur border-none mt-8">
                  <CardContent className="p-6">
                    <Zap className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">Instant Alerts</h3>
                    <p className="text-xs text-muted-foreground">Get notified on WhatsApp for your match schedule.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
