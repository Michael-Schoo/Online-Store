import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Metadata } from "next";
import {getListing} from "@/app/(main)/listing/[id]/(config)/utils";
import {prisma} from "@/lib/prisma";

export const metadata = {
    title: "Chat | listing name | online store",
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
        }
    })

    return (
        listingChats.map(chat => chat.buyerId)
    )
}