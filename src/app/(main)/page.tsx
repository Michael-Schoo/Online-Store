import prisma from "@/lib/prisma"
import Link from "next/link"

export const revalidate = 0

export default async function Home() {
    const items = await prisma.listing.findMany()

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
