import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/"
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/questions",
  "/api/assessments"
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)"
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isAccessingDashboard = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  if (isAdminRoute(req)) {
    const MY_ADMIN_USER_ID = process.env.ADMIN_USER_ID;
    // TEMPORARY: Allow all logged-in users to access admin dashboard for testing
    if (!userId) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
    /*
    if (!userId || userId !== MY_ADMIN_USER_ID) {
      if (userId) {
        console.log(`[Middleware] Admin access denied. To allow access, add ADMIN_USER_ID=${userId} to your .env.local file.`);
      }
      return NextResponse.redirect(new URL("/home", req.url));
    }
    */
  }

  if(userId && isPublicRoute(req) && !isAccessingDashboard){
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if(!userId){
    if(!isPublicRoute(req) && !isPublicApiRoute(req)){
      return NextResponse.redirect(new URL("/", req.url));
    }

    if(isApiRequest && !isPublicApiRoute(req)){
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
