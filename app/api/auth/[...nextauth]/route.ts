import { UnstorageAdapter } from "@auth/unstorage-adapter";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer, { Transporter } from "nodemailer";
import { createStorage } from "unstorage";


type JWType = {
  token: {
    id: string,
    email: string
  }
  account: any,
  user: {
    id: string,
    email: string
  }
}

type SessionType = {
  token: {
    id: string,
    email: string
  }
  session: {
    accessToken: string,
    user: {
      id: string
    }
  },
}

export async function sendVerificationRequest({
  identifier,
  url,
  provider,
}:
  {
    identifier: string;
    url: string;
    provider: any;
  }
) {

  const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const result = await transporter.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Bem-vindo ao nosso site!`,
    text: `Link para acessar o nosso site, ${url}`,
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

const storage = createStorage();

export const authOptions = {
  adapter: UnstorageAdapter(storage),
  secret: process.env.AUTH_SECRET,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,  // 1 dia
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }: JWType) {
      if (account && user) {
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: SessionType) {
      session.accessToken = token.email;
      session.user.id = token.id;
      return session;
    },
  }
}

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
