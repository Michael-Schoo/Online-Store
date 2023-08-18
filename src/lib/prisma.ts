import { PrismaClient } from "@prisma/client"

// @ts-expect-error global variable
const prisma: PrismaClient = global.prisma || new PrismaClient()

// @ts-expect-error global variable
if (process.env.NODE_ENV === "development") global.prisma = prisma

export default prisma
