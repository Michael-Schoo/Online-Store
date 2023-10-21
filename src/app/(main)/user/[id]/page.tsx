import prisma from "@/lib/prisma"
import {notFound} from "next/navigation"


export default async function UserPage({
    params: {id},
}: {
    params: { id: string }
}) {
    if (!id) return notFound()

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
            image: true
        },
    })

    if (!user) return notFound()

    return (
        <main>
            <h1>{user.name}</h1>
            <p>{user.createdAt.toDateString()}</p>
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            {user.image && <img src={user.image} alt="" crossOrigin="anonymous"/>}
        </main>
    )
}
