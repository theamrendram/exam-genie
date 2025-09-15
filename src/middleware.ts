import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  const { auth } = req;
  console.log(auth);

  if (path.startsWith("/chat") && !auth) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
