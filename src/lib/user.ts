import { cache } from "react"
import prisma from "./prisma"
import { cookies } from "next/headers"

export const getUserByToken = cache((token: string) => {

    // TODO: use jwt
    const userId = token

    return prisma.user.findUnique({
        where: {
            id: parseInt(userId)
        },
        // select: {
        //     username: true,
        //     email: true,
        // }
    })
})


export const getCurrentUser = () => {
    const token = cookies().get("token")
    if (!token) return null
    return getUserByToken(token.value)
}
