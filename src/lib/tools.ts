import crypto from "crypto"

export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
// export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
export const passwordRegex = /^.{8,}$/
export const customAWSRegex = /^[a-zA-Z0-9-\.]+$/

export const tokenLife = 1000 * 60 * 60 * 24 * 7 // 7 days

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

export const getListingImage = ({
    awsKey: s3Key,
    customAWS,
    customURL,
}: {
    awsKey?: string | null
    customAWS?: string | null
    customURL?: string | null
}) => {
    if (customAWS) {
        if (!customAWSRegex.test(customAWS)) {
            // TODO: better error
            return ""
        }
        return `https://${customAWS}.amazonaws.com/${s3Key}`
    } else if (customURL) {
        return `${customURL}/${s3Key}`
    } else if (s3Key) {
        // return `https://uploadthing-prod.s3.us-west-1.amazonaws.com/${s3Key}`
        return `https://utfs.io/f/${s3Key}`
    } else {
        return ""
    }
}
