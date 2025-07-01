import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateSecureToken, createTokenExpiry } from "@/lib/auth";
import { sendApplicationLinkEmail } from "@/lib/email";
import { TokenGenerationSchema } from "@/lib/validations";
import { getBaseUrl, createApiResponse, createApiError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        createApiError("Unauthorized", 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = TokenGenerationSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        createApiError("Invalid request data", 400, validation.error.errors),
        { status: 400 }
      );
    }

    const { applicantEmail, expiresAt } = validation.data;
    
    // Generate secure token
    const token = generateSecureToken();
    const expiry = expiresAt ? new Date(expiresAt) : createTokenExpiry();
    
    // Create token record in database
    const applicationToken = await prisma.applicationToken.create({
      data: {
        token,
        recruiterEmail: session.user.email,
        applicantEmail,
        expiresAt: expiry,
      },
    });

    // Send email with application link
    const baseUrl = getBaseUrl();
    const applicationUrl = `${baseUrl}/apply/${token}`;
    
    const emailResult = await sendApplicationLinkEmail({
      applicantEmail,
      token,
      recruiterName: session.user.name || "TalentCore Recruiter",
      expiresAt: expiry,
    });

    return NextResponse.json(
      createApiResponse({
        id: applicationToken.id,
        token: applicationToken.token,
        applicationUrl,
        expiresAt: applicationToken.expiresAt,
        emailSent: emailResult.success,
        emailError: emailResult.success ? undefined : emailResult.error,
      }, "Application link generated successfully")
    );
  } catch (error) {
    console.error("Generate link error:", error);
    return NextResponse.json(
      createApiError("Failed to generate application link", 500),
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
    const status = searchParams.get("status"); // "used", "expired", "active"

    const skip = (page - 1) * limit;
    const now = new Date();

    // Build where clause based on filters
    let where: any = {
      recruiterEmail: session.user.email,
    };

    if (status === "used") {
      where.usedAt = { not: null };
    } else if (status === "expired") {
      where.expiresAt = { lt: now };
      where.usedAt = null;
    } else if (status === "active") {
      where.expiresAt = { gt: now };
      where.usedAt = null;
    }

    const [tokens, total] = await Promise.all([
      prisma.applicationToken.findMany({
        where,
        include: {
          application: {
            select: {
              id: true,
              fullName: true,
              status: true,
              submittedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.applicationToken.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      createApiResponse({
        tokens,
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
    console.error("Get tokens error:", error);
    return NextResponse.json(
      createApiError("Failed to fetch tokens", 500),
      { status: 500 }
    );
  }
}