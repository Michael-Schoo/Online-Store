import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { listingUpdateSchema } from "@/lib/validations/listing"
import { NextResponse } from "next/server"

export async function PATCH(
    request: Request,
    { params: { id } }: { params: { id: string } },
) {
    const res = await request.json()

    // todo: validate is user ID actually exists (only when if you can delete account) 
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const inputParsed = listingUpdateSchema.partial().safeParse(res)
    if (inputParsed.success === false) {
        return NextResponse.json(
            inputParsed.error.flatten().fieldErrors,
            { status: 400 },
        )
    }

    const input = inputParsed.data
    try {
        const listing = await prisma.listing.update({
            where: {
                id,
                userId: user.id,
                locked: false,
                archived: false,
            },
            data: {
                ...input,
                tags: input.tags
                    ? {
                        connectOrCreate: input.tags.map((tag) => ({
                            where: {
                                name: tag,
                            },
                            // TODO: possibly not allow creating tags
                            create: {
                                name: tag,
                            },
                        })),
                    }
                    : undefined,
            },
            
        })
        return NextResponse.json({ listing }, { status: 200 })

    } catch (e) {

        return NextResponse.json({ error: "Listing could not be updated" }, { status: 400 })
    }
}
