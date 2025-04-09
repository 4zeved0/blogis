import { UnstorageAdapter } from "@auth/unstorage-adapter";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer, { Transporter } from "nodemailer";
import { createStorage } from "unstorage";

// Criação do storage para adapter
const storage = createStorage();

// ⚠️ ATENÇÃO: função interna, não exportada!
async function sendVerificationRequest({
  identifier,
  url,
  provider,
}: {
  identifier: string;
  url: string;
  provider: any;
}) {
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
    text: `Link para acessar o nosso site: ${url}`,
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

// Tipagens
type JWType = {
  token: {
    id: string;
    email: string;
  };
  account: any;
  user: {
    id: string;
    email: string;
  };
};

type SessionType = {
  session: {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
    };
    expires: string;
    accessToken?: string;
  };
  token: {
    id?: string;
    email?: string;
    accessToken?: string;
    [key: string]: any;
  };
  user?: {
    id?: string;
    email?: string;
  };
};


// Configurações do NextAuth
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
    maxAge: 24 * 60 * 60, // 1 dia
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.email = user.email
        token.id = user.id
      }

      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      session.user.id = token.id

      return session
    }
  }
},
});

// Exportações corretas para App Router
export { handler as GET, handler as POST };
