import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Target, 
  ShieldCheck, 
  Users, 
  Zap, 
  Gamepad2,
  Cpu,
  Globe
} from "lucide-react"

export default function AboutPage() {
  const stats = [
    { label: "Tournaments Hosted", value: "500+", icon: Trophy },
    { label: "Active Players", value: "50k+", icon: Users },
    { label: "Prize Money Distributed", value: "₹2.5Cr+", icon: Zap },
    { label: "Supported Games", value: "10+", icon: Gamepad2 },
  ]

  const values = [
    {
      title: "Fair Play First",
      description: "Our state-of-the-art anti-cheat integration and manual verification ensure a level playing field for everyone.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Fast Payouts",
      description: "No more waiting weeks for your winnings. Our automated system processes prize money within 24 hours of result verification.",
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    {
      title: "Global Standards",
      description: "We bring international esports standards to local communities, providing professional-grade match management.",
      icon: Globe,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Performance Driven",
      description: "Our platform is optimized for speed, ensuring you spend less time in menus and more time in matches.",
      icon: Cpu,
      color: "text-green-500",
      bg: "bg-green-500/10"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary px-4 py-1">
            Empowering the Next Generation of Gamers
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            The Future of <span className="text-primary">Indian Esports</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Jaipal Esports is India&apos;s premier tournament orchestration platform. We bridge the gap between amateur talent and professional gaming through seamless, secure, and competitive infrastructure.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <stat.icon className="h-4 w-4 text-primary" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to democratize esports by providing every gamer, regardless of their skill level or location, a professional platform to compete, grow, and earn. We believe that competitive gaming should be transparent, fair, and accessible.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Transparent Competition</h3>
                    <p className="text-sm text-muted-foreground">Every match, every bracket, and every payout is verifiable and fair.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                    <Gamepad2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Career Pathways</h3>
                    <p className="text-sm text-muted-foreground">We help top talent get noticed by professional teams and sponsors.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border bg-card">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                  <Gamepad2 className="h-24 w-24 text-primary opacity-20 animate-pulse" />
               </div>
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/80 backdrop-blur-md rounded-xl border">
                  <p className="text-sm italic font-medium">
                    &quot;Gaming is no longer just a hobby; it&apos;s a profession. We provide the arena for you to prove it.&quot;
                  </p>
                  <p className="text-xs text-primary mt-2 font-bold">— Jaipal Esports Leadership</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Jaipal Esports?</h2>
            <p className="text-muted-foreground">The core pillars that make us the most trusted platform in India.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <Card key={i} className="border-none shadow-none bg-transparent hover:bg-muted/50 transition-colors">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl ${value.bg} flex items-center justify-center mb-6`}>
                    <value.icon className={`h-6 w-6 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of players who are already competing in the biggest tournaments in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Card className="bg-background text-foreground border-none px-8 py-3 font-bold hover:bg-secondary/10 transition-colors cursor-pointer">
                Browse Tournaments
             </Card>
             <Card className="bg-transparent text-primary-foreground border-2 border-primary-foreground px-8 py-3 font-bold hover:bg-primary-foreground hover:text-primary transition-all cursor-pointer">
                Join our Discord
             </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
