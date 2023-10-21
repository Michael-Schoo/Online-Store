import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { getUser } from "@/app/(main)/(settings)/utils";
import { Metadata } from "next";

export const metadata = {
    title: "Purchases",
    description: "See your money flow throughout listings.",
} satisfies Metadata

export default async function PurchasesPage() {
    const user = await getCurrentUser()

    const userFetched = await getUser(user?.id ?? '')
    if (!userFetched) redirect(authOptions?.pages?.signIn || "/login")

    return (
        <DashboardShell>
            <DashboardHeader
                heading={metadata.title}
                text={metadata.description}
            />
            <div className="grid gap-10">
                some cards should be here
                {/* show current balance - with disabled top up button */}
                {/* show list/blocks of purchases */}
            </div>
        </DashboardShell>
    )
}