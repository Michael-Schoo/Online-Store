import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import {createCounterOfferSchema, createMessageSchema, listingImageSchema} from "@/lib/validations/listing"
import { NextResponse } from "next/server"
import { utapi } from "uploadthing/server"
import {notFound} from "next/navigation";
import {ChatMessageType} from "@prisma/client";


export const revalidate = 0
export const dynamic = 'force-dynamic'


export async function POST(
    request: Request,
    { params: { id: listingId, userId } }: { params: { id: string, userId: string } },
) {

    const res = await request.json()

    // todo: validate is user ID actually exists (only when if you can delete account)
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId
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
    if (!listingChat && listing.archived) return notFound()


    const inputParsed = createCounterOfferSchema.safeParse(res)
    if (inputParsed.success === false) {
        return NextResponse.json(
            inputParsed.error.flatten().fieldErrors,
            { status: 400 },
        )
    }

    const input = inputParsed.data

    const chatMessage = await prisma.listingChatMessage.create({
        data: {
            message: input.price.toString(),
            buyerId: userId,
            userId: user.id,
            listingId,
            type: ChatMessageType.COUNTER_OFFER,
        },
        select: {
            id: true,
        }
    })

    return NextResponse.json({ id: chatMessage.id }, { status: 200 })
}
