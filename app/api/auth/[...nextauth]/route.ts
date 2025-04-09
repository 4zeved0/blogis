import { UnstorageAdapter } from "@auth/unstorage-adapter";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { createStorage } from "unstorage";
import type { SendVerificationRequestParams } from "next-auth/providers/email";


const storage = createStorage();

const sendVerificationRequest = async ({
  identifier,
  url,
  provider,
}: SendVerificationRequestParams) => {
  const transporter = nodemailer.createTransport({
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
    text: `Link para acessar o nosso site: ${url}`,
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
};


const handler = NextAuth({
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
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {
          id: token.id as string,
          name: null,
          email: token.email ?? null,
          image: null,
        };

      }

      session.user.id = token.id as string;
      session.accessToken = token.accessToken;

      return session;
    }

  },
});

export { handler as GET, handler as POST };
