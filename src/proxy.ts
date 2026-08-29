import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import type { NextFetchEvent } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/"
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/questions",
  "/api/assessments",
  "/api/execute",
  "/api/seed-aqua"
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)"
]);

const clerkAuth = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isAccessingDashboard = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  // Helper to attach security headers to responses
  const withSecurityHeaders = (response: NextResponse) => {
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    return response;
  };

  if (isAdminRoute(req)) {
    const MY_ADMIN_USER_ID = process.env.ADMIN_USER_ID;
    // TEMPORARY: Allow all logged-in users to access admin dashboard for testing
    if (!userId) {
      return withSecurityHeaders(NextResponse.redirect(new URL("/home", req.url)));
    }
  }

  if(userId && isPublicRoute(req) && !isAccessingDashboard && currentUrl.pathname !== "/"){
    return withSecurityHeaders(NextResponse.redirect(new URL("/home", req.url)));
  }

  if(!userId){
    if(!isPublicRoute(req) && !isPublicApiRoute(req)){
      return withSecurityHeaders(NextResponse.redirect(new URL("/sign-in", req.url)));
    }

    if(isApiRequest && !isPublicApiRoute(req)){
      return withSecurityHeaders(NextResponse.redirect(new URL("/sign-in", req.url)));
    }
  }

  return withSecurityHeaders(NextResponse.next());
});

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  return clerkAuth(request, event);
}

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
