import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var Prisma: PrismaClient | undefined;
}

export const Prisma =
  global.Prisma ||
  new PrismaClient({
    log:  process.env.NODE_ENV === "development" ?
      ['info', 'warn', 'error']
      :
      ['warn', 'error'],
  });

if (process.env.NODE_ENV !== "production") global.Prisma = Prisma;
