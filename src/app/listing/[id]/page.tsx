
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function ListingPage({ params: { id } }: { params: { id: string } }) {
    const listing = await prisma.listing.findUnique({ where: { id: Number(id) } })
    if (!listing) return notFound();

    return (
        JSON.stringify(listing, null, 2)
    )
}

