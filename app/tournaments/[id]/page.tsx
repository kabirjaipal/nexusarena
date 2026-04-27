"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Trophy, Gamepad2, Zap, Clock, Loader2, MapPin, User, Award, CheckCircle } from "lucide-react"
import { formatDate, formatDateTime } from "@/lib/date-utils"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface TournamentDetail {
  id: string
  slug: string
  title: string
  game: string
  description: string
  entryFee: number
  prizePool: number
  maxPlayers: number
  minPlayers: number
  currentPlayers: number
  startDate: string
  endDate: string
  registrationStart: string
  registrationEnd: string
  status: string
  rules: string
  banner?: string
  registrations: Array<{
    id: string
    userId: string
    userName: string
    userImage?: string
    registeredAt: string
    status: string
  }>
  matches: Array<{
    id: string
    round: number
    matchNumber: number
    player1Id?: string
    player2Id?: string
    winnerId?: string
    status: string
    scheduledAt?: string
    startedAt?: string
    endedAt?: string
  }>
}

const getGameIcon = (game: string) => {
  switch (game) {
    case 'FREE_FIRE':
      return Zap
    default:
      return Gamepad2
  }
}

const getGameColor = (game: string) => {
  switch (game) {
    case 'PUBG':
      return 'text-pubg'
    case 'FREE_FIRE':
      return 'text-freefire'
    case 'BGMI':
      return 'text-bgmi'
    case 'VALORANT':
      return 'text-valorant'
    case 'CS2':
      return 'text-cs2'
    default:
      return 'text-primary'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'REGISTRATION_OPEN':
      return <Badge variant="default">Registration Open</Badge>
    case 'ONGOING':
      return <Badge variant="secondary">Ongoing</Badge>
    case 'COMPLETED':
      return <Badge variant="outline">Completed</Badge>
    case 'UPCOMING':
      return <Badge variant="secondary">Upcoming</Badge>
    case 'REGISTRATION_CLOSED':
      return <Badge variant="destructive">Registration Closed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getMatchStatusBadge = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return <Badge variant="outline">Scheduled</Badge>
    case 'ONGOING':
      return <Badge variant="default">Ongoing</Badge>
    case 'COMPLETED':
      return <Badge variant="secondary">Completed</Badge>
    case 'CANCELLED':
      return <Badge variant="destructive">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function TournamentDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [tournament, setTournament] = useState<TournamentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setIsLoading(true)
        const { id: slug } = await params
        const response = await fetch(`/api/tournaments/${slug}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch tournament')
        }
        
        const data = await response.json()
        setTournament(data)
        
        // Check if user is already registered
        if (session?.user?.id) {
          const isUserRegistered = data.registrations.some((reg: any) => reg.userId === session.user.id)
          setIsRegistered(isUserRegistered)
        }
      } catch (err) {
        console.error('Error fetching tournament:', err)
        setError(err instanceof Error ? err.message : 'Failed to load tournament')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTournament()
  }, [params])

  const handleRegister = async () => {
    if (!session) {
      toast.error("Please sign in to register for tournaments")
      return
    }

    if (!tournament) return

    try {
      setIsRegistering(true)
      
      // Create payment order
      const response = await fetch(`/api/tournaments/${tournament.slug}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment order')
      }

      const { orderId, amount, currency, paymentId, key } = await response.json()

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: 'Jaipal Esports',
          description: `Registration for ${tournament.title}`,
          order_id: orderId,
          handler: async function (response: any) {
            try {
              // Verify payment
              const verifyResponse = await fetch(`/api/tournaments/${tournament.slug}/register`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  paymentId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature
                })
              })

              if (verifyResponse.ok) {
                toast.success("Registration successful!")
                // Refresh tournament data
                window.location.reload()
              } else {
                const error = await verifyResponse.json()
                toast.error(error.error || "Payment verification failed")
              }
            } catch (error) {
              console.error('Payment verification error:', error)
              toast.error("Payment verification failed")
            }
          },
          prefill: {
            name: session.user?.name || '',
            email: session.user?.email || '',
          },
          theme: {
            color: '#2563eb'
          }
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
      document.body.appendChild(script)

    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to register for tournament")
    } finally {
      setIsRegistering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive">Error loading tournament: {error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const GameIcon = getGameIcon(tournament.game)
  const gameColor = getGameColor(tournament.game)
  const startDate = new Date(tournament.startDate)
  const endDate = new Date(tournament.endDate)
  const registrationStart = new Date(tournament.registrationStart)
  const registrationEnd = new Date(tournament.registrationEnd)
  const isRegistrationOpen = tournament.status === "REGISTRATION_OPEN"
  const canRegister = isRegistrationOpen && tournament.currentPlayers < tournament.maxPlayers

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Tournament Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GameIcon className={`h-5 w-5 ${gameColor}`} />
            <span className="text-sm text-muted-foreground">{tournament.game}</span>
            {getStatusBadge(tournament.status)}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{tournament.title}</h1>
          
          {tournament.banner && (
            <div className="mb-6">
              <img 
                src={tournament.banner} 
                alt={tournament.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Tournament</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {tournament.description}
                </p>
              </CardContent>
            </Card>

            {/* Tournament Details */}
            <Card>
              <CardHeader>
                <CardTitle>Tournament Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">{formatDateTime(startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">{formatDateTime(endDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Players</p>
                      <p className="text-sm text-muted-foreground">
                        {tournament.currentPlayers}/{tournament.maxPlayers} registered
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-warning" />
                    <div>
                      <p className="text-sm font-medium">Prize Pool</p>
                      <p className="text-sm text-muted-foreground">₹{tournament.prizePool.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Tournament Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-muted-foreground">
                  {tournament.rules}
                </div>
              </CardContent>
            </Card>

            {/* Matches */}
            {tournament.matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tournament.matches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Round {match.round} - Match {match.matchNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {match.scheduledAt && formatDateTime(new Date(match.scheduledAt))}
                          </p>
                        </div>
                        {getMatchStatusBadge(match.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹{tournament.entryFee}</div>
                  <div className="text-sm text-muted-foreground">Entry Fee</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Registration Opens:</span>
                    <span>{formatDate(registrationStart)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Closes:</span>
                    <span>{formatDate(registrationEnd)}</span>
                  </div>
                </div>

                {isRegistered ? (
                  <Button className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Already Registered
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    disabled={!canRegister || isRegistering}
                    onClick={handleRegister}
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : !session ? (
                      "Sign In to Register"
                    ) : !canRegister ? (
                      tournament.currentPlayers >= tournament.maxPlayers ? "Tournament Full" : "Registration Closed"
                    ) : (
                      "Register Now"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Prize Pool */}
            <Card>
              <CardHeader>
                <CardTitle>Prize Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">₹{tournament.prizePool.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Prize Pool</div>
                </div>
              </CardContent>
            </Card>

            {/* Registered Players */}
            <Card>
              <CardHeader>
                <CardTitle>Registered Players ({tournament.registrations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tournament.registrations.map((registration) => (
                    <div key={registration.id} className="flex items-center space-x-2 p-2 rounded">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{registration.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(new Date(registration.registeredAt))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
