import { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "../../../lib/prisma"

interface Request extends NextApiRequest {
  body: {}
}

const exportMailingList = async (req: Request, res: NextApiResponse) => {
  if (
    !req.query.MAILING_LIST_SECRET ||
    req.query.MAILING_LIST_SECRET !== process.env.MAILING_LIST_SECRET
  ) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  // Get all subscribers
  const subscribers = await Prisma.mailingListSubscriber.findMany()

  // Create CSV header
  const csvHeader = [
    "id",
    "email",
    "name",
    "createdAt",
    "products",
    "tags",
  ].join(",")

  // Convert subscribers to CSV rows
  const csvRows = subscribers.map((sub) => {
    return [
      sub.id,
      sub.email,
      sub.name || "",
      sub.createdAt.toISOString(),
      `"${sub.products.join(";")}"`, // Use semicolon within quotes to handle arrays
      `"${sub.tags.join(";")}"`,
    ].join(",")
  })

  // Combine header and rows
  const csv = [csvHeader, ...csvRows].join("\n")

  // Set headers for CSV download
  res.setHeader("Content-Type", "text/csv")
  res.setHeader("Content-Disposition", "attachment; filename=mailing_list.csv")

  res.status(200).send(csv)
}

export default exportMailingList
