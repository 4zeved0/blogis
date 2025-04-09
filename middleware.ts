import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { token } = req.nextauth;

    if (!token) {
      return NextResponse.next();
    }
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login", // Página de login personalizada
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
      authorized: ({ token }) => !!token, // Permite acesso apenas se o token existir
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/new-user", "/register-itens"],
};
