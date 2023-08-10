import { validateDescription, validateImages, validateName, validatePrice, validateTags } from "@/app/create-listing/validators"
import prisma from "@/lib/prisma"
import { customAWSRegex } from "@/lib/tools"
import { getCurrentUser } from "@/lib/user"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    const res = await request.json()

    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const name = res.name as string | undefined
    const description = res.description as string | undefined
    const price = res.price as number | undefined
    const currency = res.currency as string | undefined
    const images = res.images as string[] | undefined
    // can be something like "uploadthing-prod.s3.us-west-1"
    const customAWS = res.customAWS as string | undefined
    const tags = res.tags as string[] | undefined

    if (!name || !price || !currency) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const nameError = validateName(name, true)
    const descriptionError = description ? validateDescription(description, true) : null
    const priceError = validatePrice(price, currency, true)
    const imagesError = images ? validateImages(images) : null
    const tagsError = tags ? validateTags(tags) : null
    const customAWSError = customAWS ? customAWSRegex.test(customAWS) : null

    if (nameError || descriptionError || priceError || imagesError || customAWSError) {
        return NextResponse.json({
            name: nameError || undefined,
            description: descriptionError || undefined,
            price: priceError || undefined,
            images: imagesError || undefined,
            customAWS: customAWSError ? "invalid aws subdomain" : undefined,
            tags: tagsError || undefined
        }, { status: 400 })
    }

    
    // create the listing
    const listing = await prisma.listing.create({
        data: {
            name,
            description: description || "No description provided...",
            price,
            currency,
            locked: false,
            published: false,
            publishedAt: null,
            images: {
                create: images?.map(image => ({
                    awsKey: image,
                    customAWS,
                    userId: user.id
                }))
            },
            userId: user.id,
            tags: tags ? {
                connectOrCreate: tags.map(tag => ({
                    where: {
                        name: tag,
                    },
                    // TODO: possibly not allow creating tags
                    create: {
                        name: tag
                    }
                }))
            } : undefined
        },
        select: {
            id: true
        }
    })
    
    // remove the images from "unused" table
    if (images?.length && !customAWS) {
        console.log(images)
        await prisma.unusedUploadedFile.deleteMany({
            where: {
                key: {
                    in: images,
                },
                userId: user.id
            }
        })
    }


    return NextResponse.json({
        id: listing.id
    }, { status: 200 })

}