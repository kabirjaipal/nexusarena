import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const kycSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 characters"),
  idType: z.string().min(1, "ID type is required"),
  idNumber: z.string().min(5, "ID number must be at least 5 characters"),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const kyc = await prisma.userKYC.findUnique({
      where: { userId: session.user.id }
    })

    if (!kyc) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      id: kyc.id,
      fullName: kyc.fullName,
      dateOfBirth: kyc.dateOfBirth.toISOString(),
      address: kyc.address,
      city: kyc.city,
      state: kyc.state,
      pincode: kyc.pincode,
      idType: kyc.idType,
      idNumber: kyc.idNumber,
      status: kyc.status,
      submittedAt: kyc.submittedAt.toISOString(),
      verifiedAt: kyc.verifiedAt?.toISOString() || null
    })

  } catch (error) {
    console.error("Get KYC error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    
    // Extract form data
    const kycData = {
      fullName: formData.get("fullName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      idType: formData.get("idType") as string,
      idNumber: formData.get("idNumber") as string,
    }

    // Validate input
    const validatedData = kycSchema.parse(kycData)
    
    // Validate age (must be 18+)
    const birthDate = new Date(validatedData.dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 18) {
      return NextResponse.json(
        { error: "You must be at least 18 years old to complete KYC" },
        { status: 400 }
      )
    }

    // Get uploaded files
    const idDocument = formData.get("idDocument") as File
    const addressProof = formData.get("addressProof") as File

    if (!idDocument || !addressProof) {
      return NextResponse.json(
        { error: "Both ID document and address proof are required" },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Upload files to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Store file URLs in the database
    // 3. Implement proper file validation and security
    
    // For demo purposes, we'll just store the file names
    const idDocumentPath = `kyc/${session.user.id}/id_${Date.now()}_${idDocument.name}`
    const addressProofPath = `kyc/${session.user.id}/address_${Date.now()}_${addressProof.name}`

    // Check if KYC already exists
    const existingKYC = await prisma.userKYC.findUnique({
      where: { userId: session.user.id }
    })

    let kyc
    if (existingKYC) {
      // Update existing KYC
      kyc = await prisma.userKYC.update({
        where: { userId: session.user.id },
        data: {
          fullName: validatedData.fullName,
          dateOfBirth: new Date(validatedData.dateOfBirth),
          address: validatedData.address,
          city: validatedData.city,
          state: validatedData.state,
          pincode: validatedData.pincode,
          idType: validatedData.idType,
          idNumber: validatedData.idNumber,
          idDocument: idDocumentPath,
          addressProof: addressProofPath,
          status: "PENDING",
          submittedAt: new Date(),
          verifiedAt: null,
        }
      })
    } else {
      // Create new KYC
      kyc = await prisma.userKYC.create({
        data: {
          userId: session.user.id,
          fullName: validatedData.fullName,
          dateOfBirth: new Date(validatedData.dateOfBirth),
          address: validatedData.address,
          city: validatedData.city,
          state: validatedData.state,
          pincode: validatedData.pincode,
          idType: validatedData.idType,
          idNumber: validatedData.idNumber,
          idDocument: idDocumentPath,
          addressProof: addressProofPath,
          status: "PENDING",
        }
      })
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "KYC Submitted",
        message: "Your KYC verification has been submitted successfully. We'll review it and notify you within 24-48 hours.",
        type: "SUCCESS",
      }
    })

    return NextResponse.json({
      message: "KYC submitted successfully",
      kyc: {
        id: kyc.id,
        status: kyc.status,
        submittedAt: kyc.submittedAt.toISOString()
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    console.error("Submit KYC error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}