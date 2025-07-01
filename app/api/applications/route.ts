import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApplicationSchema } from "@/lib/validations";
import { createApiResponse, createApiError, calculateAptitudeScore } from "@/lib/utils";
import { sendApplicationConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenId, ...applicationData } = body;

    // Validate token first
    if (!tokenId) {
      return NextResponse.json(
        createApiError("Token ID is required", 400),
        { status: 400 }
      );
    }

    // Find and validate token
    const token = await prisma.applicationToken.findUnique({
      where: { id: tokenId },
      include: { recruiter: true },
    });

    if (!token) {
      return NextResponse.json(
        createApiError("Invalid token", 404),
        { status: 404 }
      );
    }

    if (token.usedAt) {
      return NextResponse.json(
        createApiError("Token has already been used", 409),
        { status: 409 }
      );
    }

    if (new Date() > token.expiresAt) {
      return NextResponse.json(
        createApiError("Token has expired", 410),
        { status: 410 }
      );
    }

    // Validate application data
    const validation = ApplicationSchema.safeParse(applicationData);
    if (!validation.success) {
      return NextResponse.json(
        createApiError("Invalid application data", 400, validation.error.errors),
        { status: 400 }
      );
    }

    const validData = validation.data;

    // Calculate aptitude score
    const aptitudeScore = calculateAptitudeScore(validData.answers);

    // Create application record
    const application = await prisma.application.create({
      data: {
        tokenId: token.id,
        recruiterEmail: token.recruiterEmail,
        
        // Personal Information
        fullName: validData.fullName,
        dateOfBirth: new Date(validData.dateOfBirth),
        sinNumber: validData.sinNumber,
        phoneNumber: validData.phoneNumber,
        email: validData.email,
        address: validData.address,
        city: validData.city,
        province: validData.province,
        postalCode: validData.postalCode,
        
        // Emergency Contact
        emergencyName: validData.emergencyName,
        emergencyPhone: validData.emergencyPhone,
        emergencyRelation: validData.emergencyRelation,
        
        // Legal Status & Transportation
        workEligibility: validData.workEligibility,
        workPermitExpiry: validData.workPermitExpiry ? new Date(validData.workPermitExpiry) : null,
        hasReliableTransport: validData.hasReliableTransport,
        hasDriversLicense: validData.hasDriversLicense,
        licenseClass: validData.licenseClass,
        hasVehicle: validData.hasVehicle,
        
        // Work History & Physical
        previousExperience: validData.previousExperience,
        availableShifts: validData.availableShifts,
        physicalLimitations: validData.physicalLimitations,
        safetyEquipment: validData.safetyEquipment || [],
        
        // Job Preferences
        jobTypes: validData.jobTypes,
        wageExpectation: validData.wageExpectation,
        startDate: new Date(validData.startDate),
        isStudent: validData.isStudent,
        classSchedule: validData.classSchedule || [],
        
        // Aptitude Test
        aptitudeAnswers: validData.answers,
        aptitudeScore,
        
        // Agreement
        agreesToTerms: validData.agreesToTerms,
        digitalSignature: validData.digitalSignature,
        
        status: "pending",
      },
      include: {
        documents: true,
        token: true,
        recruiter: true,
      },
    });

    // Create document records if any
    if (validData.documents && validData.documents.length > 0) {
      await prisma.applicationDocument.createMany({
        data: validData.documents.map(doc => ({
          applicationId: application.id,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          fileType: doc.fileType,
          fileSize: doc.fileSize,
          documentType: doc.documentType,
        })),
      });
    }

    // Mark token as used
    await prisma.applicationToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    });

    // Send confirmation email
    await sendApplicationConfirmationEmail(
      validData.email,
      validData.fullName,
      application.id
    );

    return NextResponse.json(
      createApiResponse({
        id: application.id,
        status: application.status,
        aptitudeScore: application.aptitudeScore,
        submittedAt: application.submittedAt,
      }, "Application submitted successfully")
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      createApiError("Failed to submit application", 500),
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        createApiError("Unauthorized", 401),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "submittedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      recruiterEmail: session.user.email,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          documents: {
            select: {
              id: true,
              fileName: true,
              documentType: true,
              fileSize: true,
            },
          },
          token: {
            select: {
              applicantEmail: true,
              createdAt: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      createApiResponse({
        applications,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      })
    );
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      createApiError("Failed to fetch applications", 500),
      { status: 500 }
    );
  }
}