import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";


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
    params: { id }, searchParams: { image: imageIndex = '0' }
}: {
    params: { id: string }, searchParams: { image: string }
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
            //                 name: true,
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
                    name: true,
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
    }

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
        <main className='mx-auto max-w-screen-2xl px-4 mt-5'>
            <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
                <div className="h-full w-full basis-full lg:basis-4/6">
                    <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
                        {
                            listing.images?.[Number(imageIndex)] && (
                                 // eslint-disable-next-line @next/next/no-img-element
                                <img src={listing.images?.[Number(imageIndex)].url} className="h-full w-full object-contain" alt="" crossOrigin="anonymous" />
                            )
                        }

                    </div>
                    <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
                        {listing.images.map((img, i) => (
                            <li key={img.id} className="h-20 w-20">
                                <Link href={`/listing/${listing.id}?image=${i}`} scroll={false} aria-label="Enlarge product image">
                                    <div className={cn(
                                        "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black",
                                        i === Number(imageIndex) ?
                                            'border-2 border-blue-600'
                                            : 'border-neutral-200 dark:border-neutral-800'
                                    )}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img.url} className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105" alt="" crossOrigin="anonymous" />

                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="basis-full lg:basis-2/6">
                    <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
                        <h1 className="mb-2 text-5xl font-medium">
                            {listing.name}
                        </h1>
                        <div className="flex gap-2">
                            <div className="w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
                                <p>${listing.price}</p>
                            </div>

                            <div className="w-auto rounded-full text-black bg-border dark:bg-secondary p-2 text-sm dark:text-white">
                                {
                                    listing.published ? (
                                        <p>{listing.publishedAt?.toDateString()}</p>
                                        ) : (
                                        <p>Draft</p>
                                    )
                                }
                            </div>

                            <div className="w-auto rounded-full text-black bg-border dark:bg-secondary p-2 text-sm dark:text-white">
                                <Link href={`/user/${listing.user.id}`}>
                                    {listing.user.name}
                                </Link>
                            </div>

                        </div>


                    </div>
                    <p>

                    {listing.description}
                    </p>

                    <div className="flex gap-2 mt-3">

                    {isCreator ? (
                        <>
                            <Button asChild>
                                <Link href={`/listing/${listing.id}/edit`}>Edit</Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/listing/${listing.id}/chat`}>View Chats</Link>
                            </Button>
                        </>
                    ): currentUser ? (
                        <Button asChild>
                            <Link href={`/listing/${listing.id}/chat/${currentUser.id}`}>Chat</Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href={'/login?from='+ encodeURIComponent(`/listing/${listing.id}/chat`)}>Sign-in to Chat</Link>
                        </Button>
                    ) }
                    </div>



                </div>
            </div>

        </main>
    )
}
