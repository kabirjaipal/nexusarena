import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as { role?: string })?.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // For now, return default settings from environment variables or hardcoded values
    // In a real application, these would be stored in a database
    const settings = {
      // Platform Settings
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true' || false,
      registrationEnabled: process.env.REGISTRATION_ENABLED !== 'false',
      emailVerificationRequired: process.env.EMAIL_VERIFICATION_REQUIRED !== 'false',

      // Payment Settings
      minEntryFee: parseInt(process.env.MIN_ENTRY_FEE || '10'),
      maxEntryFee: parseInt(process.env.MAX_ENTRY_FEE || '1000'),
      platformFeePercentage: parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '5'),
      minPayoutAmount: parseInt(process.env.MIN_PAYOUT_AMOUNT || '50'),

      // Tournament Settings
      defaultTournamentRules: process.env.DEFAULT_TOURNAMENT_RULES || "1. Be respectful to all players\n2. No cheating or hacking\n3. Follow the tournament schedule\n4. Report issues to admins",
      maxTournamentDuration: parseInt(process.env.MAX_TOURNAMENT_DURATION || '24'),
      autoStartMatches: process.env.AUTO_START_MATCHES === 'true' || false,
      allowLateRegistrations: process.env.ALLOW_LATE_REGISTRATIONS === 'true' || false,

      // Email Settings
      smtpHost: process.env.SMTP_HOST || '',
      smtpPort: parseInt(process.env.SMTP_PORT || '587'),
      smtpUsername: process.env.SMTP_USERNAME || '',
      smtpPassword: process.env.SMTP_PASSWORD || '',
      emailFromAddress: process.env.EMAIL_FROM_ADDRESS || '',

      // Notification Settings
      emailNotificationsEnabled: process.env.EMAIL_NOTIFICATIONS_ENABLED !== 'false',
      pushNotificationsEnabled: process.env.PUSH_NOTIFICATIONS_ENABLED !== 'false',
      smsNotificationsEnabled: process.env.SMS_NOTIFICATIONS_ENABLED === 'true' || false,

      // Security Settings
      sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '60'),
      maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
      requireKYCForPayouts: process.env.REQUIRE_KYC_FOR_PAYOUTS !== 'false'
    }

    return NextResponse.json(settings)

  } catch (error) {
    console.error("Admin settings API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as { role?: string })?.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'maintenanceMode', 'registrationEnabled', 'emailVerificationRequired',
      'minEntryFee', 'maxEntryFee', 'platformFeePercentage', 'minPayoutAmount',
      'defaultTournamentRules', 'maxTournamentDuration', 'autoStartMatches',
      'allowLateRegistrations', 'smtpHost', 'smtpPort', 'smtpUsername',
      'smtpPassword', 'emailFromAddress', 'emailNotificationsEnabled',
      'pushNotificationsEnabled', 'smsNotificationsEnabled', 'sessionTimeout',
      'maxLoginAttempts', 'requireKYCForPayouts'
    ]

    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // In a real application, you would save these to a database
    // For now, we'll just return success and log the settings
    console.log('Settings updated:', body)

    // Here you would typically:
    // 1. Save settings to database
    // 2. Update environment variables or cache
    // 3. Restart services if needed
    // 4. Send notifications to other services

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    })

  } catch (error) {
    console.error("Update settings API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
