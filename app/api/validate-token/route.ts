import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isTokenExpired } from "@/lib/auth";
import { createApiResponse, createApiError } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        createApiError("Token is required", 400),
        { status: 400 }
      );
    }

    const applicationToken = await prisma.applicationToken.findUnique({
      where: { token },
      include: {
        application: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
          },
        },
        recruiter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!applicationToken) {
      return NextResponse.json(
        createApiError("Invalid token", 404),
        { status: 404 }
      );
    }

    if (isTokenExpired(applicationToken.expiresAt)) {
      return NextResponse.json(
        createApiError("Token has expired", 410),
        { status: 410 }
      );
    }

    if (applicationToken.usedAt) {
      return NextResponse.json(
        createApiError("Token has already been used", 409),
        { status: 409 }
      );
    }

    return NextResponse.json(
      createApiResponse({
        id: applicationToken.id,
        token: applicationToken.token,
        applicantEmail: applicationToken.applicantEmail,
        recruiterName: applicationToken.recruiter.name,
        recruiterEmail: applicationToken.recruiter.email,
        expiresAt: applicationToken.expiresAt,
        isValid: true,
        hasApplication: !!applicationToken.application,
        applicationStatus: applicationToken.application?.status,
      }, "Token is valid")
    );
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      createApiError("Failed to validate token", 500),
      { status: 500 }
    );
  }
}