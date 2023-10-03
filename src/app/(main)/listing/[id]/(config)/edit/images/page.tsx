import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import ClientPage from "./page.client"
import prisma from "@/lib/prisma"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { getListing } from "../../utils"

export const metadata = {
    title: "Images",
    description: "Manage and create images for your listing.",
}

export default async function ImagesPage({
    params: { id },
}: {
    params: { id: string }
}) {
    const user = await getCurrentUser()

    const listing = await getListing(id, user?.id ?? '')

    if (!listing || user?.id !== listing?.userId) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const images = await prisma.listingImage.findMany({
        where: {
            listingId: listing.id,
            userId: user.id
        },
        select: {
            alt: true,
            id: true,
            url: true,
        }
    });

    return (
        <>
            <NextSSRPlugin
                /**
                 * The `extractRouterConfig` will extract **only** the route configs
                 * from the router to prevent additional information from being
                 * leaked to the client. The data passed to the client is the same
                 * as if you were to fetch `/api/uploadthing` directly.
                 */
                routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <DashboardShell>
                <DashboardHeader
                    heading={metadata.title}
                    text={metadata.description}
                />
                <div className="grid gap-10">
                    <ClientPage images={images} listingId={listing.id} />
                </div>
            </DashboardShell>
        </>

    )
}