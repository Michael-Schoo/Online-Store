// Import required dependencies
import { connect } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { PrismaClient } from '@prisma/client';
import { env } from 'process';

function getPrisma() {
    // Initialize Prisma Client with the PlanetScale serverless database driver
    const connection = connect({ url: env.DATABASE_URL });
    const adapter = new PrismaPlanetScale(connection);
    const prisma = new PrismaClient({ adapter, log: ["query"] });

    return prisma 
}

// @ts-expect-error global variable
const prisma: PrismaClient = global.prisma || getPrisma()

// @ts-expect-error global variable
if (process.env.NODE_ENV === "development") global.prisma = prisma

export default prisma
