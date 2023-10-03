import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { InformationForm } from "./information-form.client"
import prisma from "@/lib/prisma"
import { PriceForm } from "./price-form.client"
import { getListing } from "../../utils"

export const metadata = {
    title: "Information",
    description: "Manage the data for your listing.",
}

export default async function SettingsPage({
    params: { id },
}: {
    params: { id: string }
}) {
    const user = await getCurrentUser()

    const listing = await getListing(id, user?.id ?? '')
    if (!listing) return notFound()

    if (user?.id !== listing.userId) {
        redirect(authOptions?.pages?.signIn || "/login")
    }


    return (
        <DashboardShell>
            <DashboardHeader
                heading={metadata.title}
                text={metadata.description}
            />
            <div className="grid gap-10">
                <InformationForm listing={listing} />
                <PriceForm listing={listing} />
                {/* // todo: tags section */}
            </div>
        </DashboardShell>
    )
}