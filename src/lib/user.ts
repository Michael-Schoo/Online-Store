import { cache } from "react"
import prisma from "./prisma"
import { cookies } from "next/headers"
import { pbkdf2Sync } from "crypto"
import { jwtVerify, SignJWT } from "jose"
import { randomText } from "./tools"

// get from env or make random str
const JWTToken = new TextEncoder().encode(
    process.env.JWT_TOKEN || randomText(16),
)

export const getUserByToken = cache(
    async (token: string): Promise<string | null> => {
        const jwt = await jwtVerify(token, JWTToken, { algorithms: ["HS256"] })
        const userId = jwt.payload.sub

        if (!userId) return null

        return userId
    },
)

export const createUserToken = (user: { id: number }) => {
    return new SignJWT({ hello: "world" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setNotBefore(Date.now() / 1000 - 60_000)
        .setExpirationTime("7d")
        .setSubject(user.id.toString())
        .sign(JWTToken)
}

export const getCurrentUserId = cache(async () => {
    const token = cookies().get("token")
    if (!token) return null
    try {
        return await getUserByToken(token.value)
    } catch (e) {
        console.log(e)
        return null
    }
})

export const getCurrentUser = cache(async () => {
    const userId = await getCurrentUserId()
    if (!userId) return null
    try {
        return await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
            },
            // select: {
            //     username: true,
            //     email: true,
            // }
        })
    } catch (e) {
        console.log(e)
        return null
    }
})

export const createPasswordHash = async (password: string) => {
    const salt = randomText(16)
    const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")

    return `sha512:${salt}:${hash}`
}

export const verifyPassword = (
    proposedPassword: string,
    passwordHash: string,
) => {
    const [algorithm, salt, hash] = passwordHash.split(":")
    if (!algorithm || !salt || !hash) return false

    const proposedHash = pbkdf2Sync(
        proposedPassword,
        salt,
        1000,
        64,
        algorithm,
    ).toString("hex")

    return proposedHash === hash
}
