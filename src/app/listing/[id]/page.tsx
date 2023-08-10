
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
            averageRating: true,
            reviews: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    user: {
                        select: {
                            username: true,
                            id: true,
                        }
                    }
                }
            },
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
    const currentUser = await getCurrentUserId()
    const isCreator = currentUser === listing.user.id.toString()
    // if (!listing.published && !isCreator) {
    //     return "DRAFT... check later :)"
    //     // return notFound()
    // };

    const images = listing.images.map(getListingImage)

    return (
        <div>
            <h1>{listing.name}</h1>
            <p>{listing.description}</p>
            <p>${listing.price} ({listing.currency})</p>
            <p>{listing.tags.map(tag => tag.name).join(", ")}</p>
            <p>{listing.publishedAt?.toISOString()}</p>
            <p>{listing.published ? "Published" : "Draft"}</p>
            <p>@{listing.user.username}{isCreator && " (You!)"}</p>
            <div>
                {images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img} alt="" crossOrigin="anonymous" />
                ))}
            </div>
            <div>
                <ul>
                    {listing.reviews.map(review => (
                        <li key={review.id}>
                            <p>{review.rating}/5 ({review.createdAt.toISOString()})</p>
                            <p>@{review.user.username}</p>
                            <p>{review.comment}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

