import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const authToken = request.cookies.get("token")?.value;
  //   return NextResponse.redirect(new URL("/home", request.url));
  const decodedToken = jwt.decode(authToken);
  const loggedInUserNotAccess = ["/login", "/signup"].includes(
    request.nextUrl.pathname
  );

  if (decodedToken.role === "patient" && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    decodedToken.role === "doctor" &&
    request.nextUrl.pathname === "/users/profile"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (loggedInUserNotAccess && authToken) {
    return NextResponse.redirect(
      new URL(
        `/${decodedToken.role === "patient" ? "users" : "doctors"}/profile`,
        request.url
      )
    );
  } else {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/doctors/profile",
    "/users/profile",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
