import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  //1. check logging status ture or false
  const isLoggedIn = !!req.auth;

  //2.use routes
  //always need to be open becuase user has some api loggin methods
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  //publically accessible routes in app
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  //protected resource, login is required for access
  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);

  //3.actions needs to be done for each type of routes
  //simply give permission
  if (isApiAuthRoute) return;

  //
  if (isProtectedRoute) {
    // protected and user already logged in the redirect
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); //here nextUrl is need for build absolute path url
    }
    //otherwise restrict
    return;
  }

  //
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return;
});

//matcher that runner in middleware
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

////this file is not auth.js specific this specific to next js//////
