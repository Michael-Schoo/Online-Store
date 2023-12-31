import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import {createMessageSchema, listingImageSchema} from "@/lib/validations/listing"
import { NextResponse } from "next/server"
import { utapi } from "uploadthing/server"
import {notFound} from "next/navigation";


export const revalidate = 0
export const dynamic = 'force-dynamic'


export async function POST(
    request: Request,
    { params: { id: listingId, userId } }: { params: { id: string, userId: string } },
) {

    const res = await request.json()

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


    const inputParsed = createMessageSchema.safeParse(res)
    if (inputParsed.success === false) {
        return NextResponse.json(
            inputParsed.error.flatten().fieldErrors,
            { status: 400 },
        )
    }

    const input = inputParsed.data

    const chatMessage = await prisma.listingChatMessage.create({
        data: {
            message: input.message,
            buyerId: userId,
            userId: user.id,
            listingId,
            type: input.type,
        },
        select: {
            id: true,
        }
    })

    return NextResponse.json({ id: chatMessage.id }, { status: 200 })
}
