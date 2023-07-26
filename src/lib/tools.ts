import crypto from "crypto";

export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
// export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
export const passwordRegex = /^.{8,}$/

export const tokenLife = 1000 * 60 * 60 * 24 * 7 // 7 days


const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function minWait<T extends any>(ms: number, fn: () => Promise<T> | T) {
    const time = Date.now()
    const res = await fn()
    const timePassed = Date.now() - time
    if (timePassed < ms) {
        await wait(ms - timePassed)
    }

    return res
}


export function generateAvatarUrl(emailAddress: string, options: { defaultImage?: string } = {}) {
    const defaultImage = options.defaultImage || "";
    const emailHash = crypto
        .createHash("md5")
        .update(emailAddress)
        .digest("hex");

    return `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;
}

export const randomText = (size = 16) => crypto.randomBytes(size).toString('hex');
