import prisma from "@/lib/prisma";
import { cache } from "react";


export const getUser = cache(async (userId: string) => {
    return prisma.user.findUnique({
        where: {
            id: userId
        },

    })
})
