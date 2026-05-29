import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isLoginPage = nextUrl.pathname === "/admin/login";

  if (!isLoggedIn && !isLoginPage) {
    return Response.redirect(new URL("/admin/login", nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
