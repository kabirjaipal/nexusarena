import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin")
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard")
    const isProfilePage = req.nextUrl.pathname.startsWith("/profile")
    const isKYCPage = req.nextUrl.pathname.startsWith("/kyc")

    // Redirect authenticated users away from auth pages
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Protect admin routes
    if (isAdminPage && (!isAuth || token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Protect dashboard and profile routes
    if ((isDashboardPage || isProfilePage || isKYCPage) && !isAuth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
        const isAdminPage = req.nextUrl.pathname.startsWith("/admin")
        const isProtectedPage = req.nextUrl.pathname.startsWith("/dashboard") ||
                               req.nextUrl.pathname.startsWith("/profile") ||
                               req.nextUrl.pathname.startsWith("/kyc")

        // Allow access to auth pages without token
        if (isAuthPage) {
          return true
        }

        // Require token for protected pages
        if (isProtectedPage) {
          return !!token
        }

        // Require admin role for admin pages
        if (isAdminPage) {
          return !!token && (token.role === "ADMIN" || token.role === "SUPER_ADMIN")
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/kyc/:path*",
    "/admin/:path*",
    "/auth/:path*"
  ]
}
