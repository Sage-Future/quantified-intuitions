import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.SECRET,
  },
  callbacks: {
    session: async (params: { session: Session; token: JWT }) => {
      const { session, token } = params;
      if (token.id) {
        session.user.id = token.id as string;
      }
      return Promise.resolve(session);
    },
    jwt: async (params: { token: JWT; user?: User | undefined }) => {
      const { token, user } = params;
      if (user) {
        token.id = user.id;
      }
      return Promise.resolve(token);
    },
  },
});
