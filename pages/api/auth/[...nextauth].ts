import NextAuth from "next-auth"
import type { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { subscribeToMailingList } from "../email/subscribe"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (user: any) => {
      const createdUser = await PrismaAdapter(prisma).createUser(user)

      if (createdUser.email) {
        void subscribeToMailingList([
          {
            email: createdUser.email,
            tags: ["qi-user"],
            products: ["Quantified Intuitions"],
          },
        ])
      }

      return createdUser
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  theme: {
    colorScheme: "light",
    brandColor: "#4338ca",
    logo: "https://quantifiedintuitions.org/logo.png",
  },
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.SECRET,
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: async (params: { token: JWT; user?: User }) => {
      const { token, user } = params
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
}

export default NextAuth(authOptions)
