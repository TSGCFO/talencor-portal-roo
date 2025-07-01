import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db";

export async function GET() {
  try {
    const isDatabaseHealthy = await checkDatabaseConnection();
    
    if (!isDatabaseHealthy) {
      return NextResponse.json(
        { 
          status: "unhealthy", 
          error: "Database connection failed",
          timestamp: new Date().toISOString() 
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { 
        status: "unhealthy", 
        error: "Internal server error",
        timestamp: new Date().toISOString() 
      },
      { status: 503 }
    );
  }
}