import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { utapi } from "uploadthing/server"

export const revalidate = 0

//? NOTE: if uploadthing is used for more than listings, this will need to be changed

export async function GET(request: Request) {
    const maxAge = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days
    const files = await prisma.uploadedFile.findMany({
        where: {
            uploadedAt: {
                lt: maxAge,
            },
            used: false,
        },
    })

    // early return if no files
    if (!files.length) {
        return NextResponse.json({
            amount: 0,
        })
    }

    // delete the files
    await utapi.deleteFiles(files.map((i) => i.key))

    // delete the database entries
    await prisma.uploadedFile.deleteMany({
        where: {
            uploadedAt: {
                lt: maxAge,
            },
            used: false,
        },
    })

    return NextResponse.json({
        amount: files.length,
    })
}
