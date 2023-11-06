import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Metadata } from "next";
import { getListing } from "@/app/(main)/listing/[id]/(config)/utils";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "Chats that are open for you",
    description: "Chat to the listing owner",
} satisfies Metadata

export default async function ChatPage({
    params: { id },
}: {
    params: { id: string }
}) {
    const user = await getCurrentUser()
    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const listing = await prisma.listing.findUnique({
        where: {
            id
        }
    })

    if (!listing) return notFound()
    if (user.id !== listing.userId) return redirect(`/listing/${listing.id}/chat/${user.id}`)

    let listingChats = await prisma.listingChat.findMany({
        where: {
            listingId: listing.id,
        },
        select: {
            listingId: true,
            listing: {
                select: {
                    name: true
                }
            },
            buyerId: true,
            buyer: {
                select: {
                    name: true
                }
            },
            archived: true
        }
    })
    
    return (
        listingChats.map(chat => (
            <Link
                key={`${chat.listingId}-${chat.buyerId}`}
                href={`/listing/${chat.listingId}/chat/${chat.buyerId}`}
                className={cn('hover:underline', chat.archived && 'text-gray-500')}
            >
                &quot;{listing.name}&quot; and &quot;{chat.buyer.name}&quot;
                <br />
            </Link>
        ))
    )
}