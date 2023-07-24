import prisma from "@/lib/prisma"

export const revalidate = 0

export default async function Home() {
  const items = await prisma.storeItem.findMany()

  return (
    <main>
      <h1>Store</h1>
      <div>
        {items.map((item) => (
          <div key={item.id}>
            <h2><b>Name:</b> {item.name}</h2>
            <p><b>description:</b> {item.description}</p>
            <p>${item.price}</p>
          </div>
        ))}

      </div>
    </main>
  )
}
