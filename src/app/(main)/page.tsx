import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"

export const revalidate = 0

export default async function Home() {
    const currentUser = await getCurrentUser()
    const items = await prisma.listing.findMany({
        where: {
            // todo: fix temporary way to still see posts made by user
            OR: [
                { published: true },
                { userId: currentUser?.id ?? '' }
            ],
            archived: false
        }
    })

    return (
        <main className="container">
            <h1 className="text-xl my-4">Store</h1>
            <div>
                {items.map((item) => (
                    <div className="mb-3" key={item.id}>
                        <Link href={'/listing/' + item.id} >
                            <h2>
                                <b>Name:</b> {item.name}
                            </h2>
                            <p>
                                <b>description:</b> {item.description}
                            </p>
                            <p>${item.price}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    )
}
