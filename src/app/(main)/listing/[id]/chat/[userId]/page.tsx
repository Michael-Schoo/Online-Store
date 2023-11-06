import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ChatList } from "@/components/ChatList";
import { EmptyScreen } from "@/components/EmptyChatScreen";
import { ChatForm } from "@/components/ChatForm";
import { generateAvatarUrl } from "@/lib/tools";
import { ChatMessageType } from "@prisma/client";
import { getListing } from "../../(config)/utils"
import { metadata as rootMetadata } from "@/app/layout"

const siteName = (rootMetadata!.title as { default: string })!.default

export async function generateMetadata({ params }: { params: { id: string } }) {
    const user = await getCurrentUser()
    const listing = await getListing(params.id, user?.id ?? '')
    if (!listing) return notFound()

    return {
        title: {
            template: `%s | ${listing.name} | ` + siteName,
            default: `Chat for "${listing.name}" | ` + siteName
        },
        robots: {
            index: false
        }
    } satisfies Metadata
}

export default async function ChatPage({
    params: { id, userId }
}: {
    params: { id: string, userId: string }
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
    if (user.id !== listing.userId && user.id !== userId) return notFound()

    let listingChat = await prisma.listingChat.findUnique({
        where: {
            listingId_buyerId: {
                listingId: listing.id,
                buyerId: userId
            }
        }
    })


    if (!listingChat && user.id === listing.userId) return notFound()
    if (!listingChat && listing.archived) return 'listing expired'

    if (!listingChat) {
        listingChat = await prisma.listingChat.create({
            data: {
                listingId: listing.id,
                buyerId: user.id
            }
        })
    }

    const messages = await prisma.listingChatMessage.findMany({
        where: {
            listingId: listingChat.listingId,
            buyerId: listingChat.buyerId,
        },
        select: {
            message: true,
            type: true,
            userId: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    id: true,
                    email: true,
                    image: true
                }
            }
        }
    })

    const messagesFormatted = messages.map(m => {
        return {
            message: m.message,
            type: m.type,
            user: {
                id: m.userId,
                name: m.user.name || 'User',
                avatar: m.user.image || generateAvatarUrl(m.user.email),
                isYou: m.userId === user.id
            },
            createdAt: m.createdAt
        } satisfies ChatList['messages'][0]
    })

    // to test counter offer
    // messagesFormatted[2] = {
    //     ...messagesFormatted[2],
    //     type: ChatMessageType.COUNTER_OFFER
    // }

    return (
        <>
            <div className='pb-[200px] pt-4 md:pt-10'>
                {messages.length ? (
                    <>
                        <ChatList messages={messagesFormatted} currentPrice={listing.price!} />
                    </>
                ) : (
                    // <EmptyScreen setInput={setInput} />
                    <EmptyScreen />
                )}
            </div>

            <ChatForm id={{ listingId: listingChat.listingId, userId: listingChat.buyerId }} currentPrice={listing.price!} />

        </>
    )
}