import crypto from "crypto"

export const currencies = [
    { name: "USD", symbol: "$" },
    { name: "AUD", symbol: "A$" },
]

export const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

export async function minWait<T extends any>(
    ms: number,
    fn: () => Promise<T> | T,
) {
    const time = Date.now()
    const res = await fn()
    const timePassed = Date.now() - time
    if (timePassed < ms) {
        await wait(ms - timePassed)
    }

    return res
}

export function generateAvatarUrl(
    emailAddress: string,
    options: { defaultImage?: string } = {},
) {
    const defaultImage = options.defaultImage || ""
    const emailHash = crypto
        .createHash("md5")
        .update(emailAddress)
        .digest("hex")

    return `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`
}

export const randomText = (size = 16) =>
    crypto.randomBytes(size).toString("hex")
