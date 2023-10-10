// Import required dependencies
import { connect } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { PrismaClient } from '@prisma/client';
import { env } from '@/env';

function getDB() {
    // Initialize Prisma Client with the PlanetScale serverless database driver
    const connection = connect({ url: env.DATABASE_URL });
    const adapter = new PrismaPlanetScale(connection);
    const prisma = new PrismaClient({ adapter, log: ["query"] });

    return { connection, prisma }
}

declare namespace global {
    var db: ReturnType<typeof getDB> | undefined
}

const db = global.db || getDB()

if (process.env.NODE_ENV === "development") global.db = db

export const connection = db.connection
export const prisma = db.prisma
export default db.prisma
