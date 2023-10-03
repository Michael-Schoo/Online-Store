import * as z from "zod"
import { currencies } from "../tools"

export const listingCreateSchema = z.object({
    name: z.string().min(5).max(50),
})

export const listingUpdateSchema = listingCreateSchema.extend({
    name: z.string().min(5).max(50),
    description: z.string().min(10).max(3_500),
    price: z.number().min(0).max(10_000).transform(v => Math.round(v * 100) / 100),
    // currency: z.enum(currencies.map(c => c.name) as [string, ...string[]]),
    tags: z.array(z.string().min(1).max(20)).max(5),
    // stock: z.number().positive().max(99),
})

export const listingImageSchema = z.object({
    alt: z.string().min(1).max(250),
})
export const listingImageAddSchema = listingImageSchema.partial().extend({
    img: z.string().url().startsWith("https://utfs.io/f/", { message: "Must use uploadthing url" }),
})
