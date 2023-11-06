import prisma from "@/lib/prisma";
import { cache } from "react";

// cached query so that it can be used multiple times in render and not cause multiple requests
export const getUser = cache(async (userId: string) => {
    return prisma.user.findUnique({
        where: {
            id: userId
        },

    })
})
