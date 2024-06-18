import { NextRequest, NextResponse, userAgent } from "next/server";
import jwt from "jsonwebtoken";
import { PayLoad } from "./interfaces/User";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest): NextResponse | undefined {
  const { device, os, browser } = userAgent(request);
  const authToken = request.cookies.get("token")?.value;
  //   return NextResponse.redirect(new URL("/home", request.url));
  const decodedToken = jwt.decode(authToken || "") as PayLoad;
  const loggedInUserNotAccess = ["/login", "/signup"].includes(
    request.nextUrl.pathname
  );
  const loggedInAdminNotAccess = ["/admin/login", "/login", "/signup"].includes(
    request.nextUrl.pathname
  );
  const profileNotAccess = [
    "/doctors/profile",
    "/users/profile",
    "/admin",
    "/drop-for-life/donate",
  ].includes(request.nextUrl.pathname);

  const prescriptionNotAccess =
    request.nextUrl.pathname.startsWith("/prescription");

  if (decodedToken) {
    if (
      decodedToken.role !== "patient" &&
      request.nextUrl.pathname === "/users/profile"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      decodedToken.role !== "doctor" &&
      request.nextUrl.pathname === "/doctors/profile"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      decodedToken.role !== "admin" &&
      (request.nextUrl.pathname === "/admin" ||
        request.nextUrl.pathname === "/admin/login")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (request.nextUrl.pathname === "/admin/login") {
    const browserName = browser.name || "";
    const deviceModel =
      device.vendor && device.model ? `${device.vendor} ${device.model}` : "";
    const OS = os.name && os.version ? `${os.name}  ${os.version}` : "";

    const response = NextResponse.next();

    // Set data into the request headers
    response.headers.set("x-forwarded-user-browser", browserName);
    response.headers.set("x-forwarded-user-device", deviceModel);
    response.headers.set("x-forwarded-user-os", OS);

    return response;
  }

  if (loggedInAdminNotAccess && authToken && decodedToken.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  } else if (loggedInUserNotAccess && authToken) {
    return NextResponse.redirect(
      new URL(
        `/${decodedToken.role === "patient" ? "users" : "doctors"}/profile`,
        request.url
      )
    );
  } else if (profileNotAccess && !authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (prescriptionNotAccess && !authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/admin",
    "/admin/login",
    "/doctors/profile",
    "/users/profile",
    "/prescription/:path",
    "/drop-for-life/donate",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
