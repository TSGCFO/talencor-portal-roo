import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers to all routes
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/signin", "/api/health"];
  
  // API routes that don't require authentication
  const publicApiRoutes = [
    "/api/auth",
    "/api/validate-token",
    "/api/applications", // This will be protected by token validation
    "/api/upload", // This will be protected by token validation
    "/api/health",
  ];

  // Routes that require token validation instead of auth
  const tokenProtectedRoutes = ["/apply"];

  // Check if route is public
  if (publicRoutes.some(route => pathname === route)) {
    return response;
  }

  // Check if API route is public
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return response;
  }

  // Handle token-protected routes (application form)
  if (tokenProtectedRoutes.some(route => pathname.startsWith(route))) {
    const token = pathname.split("/")[2]; // Extract token from /apply/[token]
    
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Token validation will be handled by the page component
    return response;
  }

  // For all other routes, check authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to signin if not authenticated
  if (!token) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check role-based access for admin routes
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};