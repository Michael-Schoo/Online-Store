import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    listingImages: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {

            // This code runs on your server before upload
            const user = await getCurrentUser()

            // If you throw, the user will not be able to upload
            if (!user) throw new Error("Unauthorized")

            const referer = req.headers.get("referer")
            if (!referer) throw new Error("No referer")
            // url: http://localhost:3000/listing/abcdefg/edit/images
            const listingRegex = /\/listing\/([a-zA-Z0-9]+)\/edit\/images/
            const listingId = listingRegex.exec(referer)?.[1]

            // check db whether user has access to listing
            if (!listingId) throw new Error("No listing id found")
            const listing = await prisma.listing.findUnique({
                where: {
                    id: listingId,
                    userId: user.id,
                },
                select: {
                    userId: true,
                },
            })

            const imagesLength = await prisma.listingImage.count({
                where: { listingId },
            })


            // TODO: don't allow uploading more than 10 (ie already 9 + 10 should = error)
            if (!listing) throw new Error("Listing not found")
            if (imagesLength >= 10) throw new Error("Too many images")


            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id, listingId }
        })

        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload file:", file.url)

            await Promise.all([
                prisma.listingImage.create({
                    data: {
                        listingId: metadata.listingId,
                        url: file.url,
                        userId: metadata.userId,
                        alt: file.name,
                    },
                }),

            ])

            return
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
