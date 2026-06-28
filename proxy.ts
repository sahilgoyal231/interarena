import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/"
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/questions",
  "/api/assessments"
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isAccessingDashboard = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  if (isAdminRoute(req)) {
    const MY_ADMIN_USER_ID = "user_2XyourAdminIdHere";
    if (!userId || userId !== MY_ADMIN_USER_ID) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
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
})

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};