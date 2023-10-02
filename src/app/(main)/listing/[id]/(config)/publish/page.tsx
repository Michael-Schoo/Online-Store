import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import prisma from "@/lib/prisma"

export const metadata = {
    title: "Publish",
    description: "Publish your listing and do a final check.",
}

export default async function SettingsPage({
    params: { id },
}: {
    params: { id: string }
}) {

    const user = await getCurrentUser()

    const listing = await prisma.listing.findUnique({
        where: {
            id,
        },
    })

    if (!listing || user?.id !== listing?.userId) {
        redirect(authOptions?.pages?.signIn || "/login")
    }


    return (
        <DashboardShell>
            <DashboardHeader
                heading={metadata.title}
                text={metadata.description}
            />
            <div className="grid gap-10">
                {/* checklist of all requirements */}
                {/* allows the user to check the "unlisted" version */}
            </div>
        </DashboardShell>
    )
}