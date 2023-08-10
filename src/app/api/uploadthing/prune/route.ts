import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { utapi } from "uploadthing/server";


// TODO: if uploadthing is used for more than listings, this will need to be changed

export async function GET(request: Request) {
    const filesPromise = utapi.listFiles()
    const listingImagesPromise = prisma.listingImage.findMany({
        select: {
            id: true,
            awsKey: true,
        },
        where: {
            awsKey: {
                not: null
            }
        }
    })

    const [files, listingImages] = await Promise.all([filesPromise, listingImagesPromise])
    if (!files.length) {
        return NextResponse.json({
            amount: 0,
            noFiles: true
        })
    }

    // go to all the files and delete the ones that are older than 1 day and not in db
    const now = Date.now()
    // const oneDay = 1000 * 60 * 60 * 24
    const oneDay = 100
    const oneDayAgo = now - oneDay

    // filter the ones not in db
    const filesToDelete = files.filter(file => {
        return !listingImages.find(image => image.awsKey === file.key)
    })
    
    // fetch the rest and check if they are older than 1 day
    const filesToDelete2 = await Promise.all(filesToDelete.map(async file => {
        // the the api only gives the key, so we need to get the id from the url
        const res = await fetch(`https://utfs.io/f/${file.key}`)
        const lastModified = new Date(res.headers.get("last-modified")!).getTime()

        if (lastModified < oneDayAgo) {
            return file.key
        } else {
            return null
        }
    }))
    
    // filter the ones that are null
    const filesToDelete3 = filesToDelete2.filter(file => file !== null) as string[]

    // delete the files
    if (filesToDelete3.length) await utapi.deleteFiles(filesToDelete3)

    return NextResponse.json({
        amount: filesToDelete3.length
    })   
        
}
