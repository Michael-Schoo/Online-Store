
import prisma from '@/lib/prisma'
import { getListingImage } from '@/lib/tools';
import { getCurrentUser, getCurrentUserId } from '@/lib/user';
import { notFound } from 'next/navigation'

export default async function ListingPage({ params: { id } }: { params: { id: string } }) {
    const listing = await prisma.listing.findUnique({
        where: {
            id: Number(id)
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            currency: true,
            publishedAt: true,
            published: true,
            tags: {
                select: {
                    name: true,
                }
            },
            user: {
                select: {
                    username: true,
                    id: true,
                }
            },
            images: {
                select: {
                    awsKey: true,
                    customAWS: true,
                    customURL: true,
                }
            }
        }
    })

    if (!listing) return notFound();
    const isCreator = (await getCurrentUserId()) === listing.user.id.toString()
    // if (!listing.published && !isCreator) {
    //     return "DRAFT... check later :)"
    //     // return notFound()
    // };

    const images = listing.images.map(getListingImage)

    return (
        JSON.stringify({ ...listing, images }, null, 2)
    )
}

