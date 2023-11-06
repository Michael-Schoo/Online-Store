import prisma from "@/lib/prisma";
import { cache } from "react";

// also cache this query to prevent multiple requests
export const getListing = cache(async (id: string, userId: string) => {
    return prisma.listing.findUnique({
        where: {
            id,
            userId
        },

    })
})
