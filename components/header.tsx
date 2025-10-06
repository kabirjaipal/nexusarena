"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useSession, signIn, signOut } from "next-auth/react"
import { 
  Gamepad2, 
  Trophy,
  Menu,
  LogOut,
  User,
  Shield,
  Crown
} from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">Jaipal Esports</span>
            <span className="text-xs text-muted-foreground">PREMIER GAMING</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center space-x-8">
            <Link 
              href="/tournaments" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Tournaments
            </Link>
            <Link 
              href="/leaderboard" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Leaderboard
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
          </div>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/kyc" className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    KYC Verification
                  </Link>
                </DropdownMenuItem>
                {(session.user as { role?: string })?.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <Crown className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => signIn()}>
                Sign In
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <Gamepad2 className="h-8 w-8 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-foreground">Jaipal Esports</span>
                      <span className="text-xs text-muted-foreground">PREMIER GAMING</span>
                    </div>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-6 space-y-4">
                  <Link 
                    href="/tournaments" 
                    className="block p-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tournaments
                  </Link>
                  <Link 
                    href="/leaderboard" 
                    className="block p-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Leaderboard
                  </Link>
                  <Link 
                    href="/about" 
                    className="block p-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </nav>

                {/* Mobile Auth Section */}
                <div className="p-6 border-t">
                  {status === "loading" ? (
                    <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
                  ) : session ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                          <AvatarFallback>
                            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{session.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => signOut()}
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        onClick={() => signIn()}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => signIn()}
                        className="w-full"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
