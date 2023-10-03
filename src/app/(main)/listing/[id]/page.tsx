import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"


function addToAnalytics(listingId: string, day: Date | string) {
    return prisma.listingAnalytics.upsert({
        where: {
            listingId_day: {
                listingId,
                day
            }
        },
        update: {
            views: {
                increment: 1
            }
        },
        create: {
            listingId,
            day,
            views: 1,
        },
        select: {
            views: true
        }
    })
}

export default async function ListingPage({
    params: { id },
}: {
    params: { id: string }
}) {
    if (!id) return notFound()

    const listing = await prisma.listing.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            // currency: true,
            publishedAt: true,
            published: true,
            averageRating: true,
            // reviews: {
            //     select: {
            //         id: true,
            //         rating: true,
            //         comment: true,
            //         createdAt: true,
            //         user: {
            //             select: {
            //                 username: true,
            //                 id: true,
            //             },
            //         },
            //     },
            // },
            tags: {
                select: {
                    name: true,
                },
            },
            user: {
                select: {
                    username: true,
                    id: true,
                },
            },
            images: {
                select: {
                    url: true,
                    id: true
                },
            },
        },
    })

    if (!listing) return notFound()
    const currentUser = await getCurrentUser()
    const isCreator = currentUser?.id === listing.user.id
    if (!listing.published && !isCreator) {
        return "DRAFT... check later :)"
        // return notFound()
    };

    if (listing.published) {
        // add to analytics
        // day is utc day (ie. 2023-10-09)
        const now = new Date()
        now.setUTCMinutes(0)
        now.setUTCHours(0)
        now.setUTCSeconds(0)
        now.setMilliseconds(0)
        await addToAnalytics(listing.id, now)
    }


    return (
        <main>
            <h1>{listing.name}</h1>
            <p>{listing.description}</p>
            <p>
                {/* ${listing.price} ({listing.currency}) */}
                ${listing.price} (USD)
            </p>
            <p>{listing.tags.map((tag) => tag.name).join(", ")}</p>
            <p>{listing.publishedAt?.toISOString()}</p>
            <p>{listing.published ? "Published" : "Draft"}</p>
            <p>
                @{listing.user.username}
                {isCreator && " (You!)"}
            </p>
            <div>
                {listing.images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={img.id} src={img.url} alt="" crossOrigin="anonymous" />
                ))}
            </div>
        </main>
    )
}
