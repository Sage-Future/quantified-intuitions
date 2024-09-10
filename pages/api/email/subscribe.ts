import { NextApiRequest, NextApiResponse } from "next"

import { Prisma } from "../../../lib/prisma"

interface Subscriber {
  email: string
  tags?: string[]
  name?: string
  products?: string[]
  createdAt?: string // ISO string
}

interface Request extends NextApiRequest {
  body: {
    subscribers: Subscriber[]
  }
}

export default async function handler(req: Request, res: NextApiResponse) {
  if (
    process.env.MAILING_LIST_SECRET !== req.headers.authorization
  ) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const { subscribers } = req.body
  if (!Array.isArray(subscribers)) {
    res.status(400).json({
      error: `invalid request`,
    })
    return
  }

  const results = await subscribeToMailingList(subscribers)

  res.status(200).json({ results })
}

export async function subscribeToMailingList(subscribers: Subscriber[]) {
  await Prisma.$transaction(
    async (prisma) => {
      for (const { email, tags, name, products, createdAt } of subscribers) {
        const existingSubscriber =
          await prisma.mailingListSubscriber.findUnique({
            where: { email },
          })

        await prisma.mailingListSubscriber.upsert({
          where: { email },
          update: {
            tags: {
              set: Array.from(
                new Set([...(tags || []), ...(existingSubscriber?.tags || [])])
              ),
            },
            name: name || undefined,
            products: Array.from(
              new Set([
                ...(products || []),
                ...(existingSubscriber?.products || []),
              ])
            ),
          },
          create: {
            email,
            tags,
            name,
            products,
            createdAt: createdAt ? new Date(createdAt) : undefined,
          },
        })
      }
    },
    {
      timeout: 60000,
    }
  )
}
