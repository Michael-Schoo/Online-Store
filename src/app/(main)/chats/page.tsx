import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "Your chats",
    description: "Chat to the listing owner",
} satisfies Metadata

export default async function ChatPage() {
    const user = await getCurrentUser()
    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }


    let listingChats = await prisma.listingChat.findMany({
        where: {
            OR: [
                {
                    buyerId: user.id
                },
                {
                    listing: {
                        userId: user.id
                    }
                }

            ],
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
                &quot;{chat.listing.name}&quot; and &quot;{chat.buyer.name}&quot;
                <br />
            </Link>
        ))
    )
}