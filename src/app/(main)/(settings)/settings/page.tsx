import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { NameForm } from "./name-form.client"
import { getUser } from "@/app/(main)/(settings)/utils";
import { Metadata } from "next";

export const metadata = {
    title: "Settings",
    description: "Manage account and website settings.",
} satisfies Metadata

export default async function SettingsPage() {
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
                <NameForm user={userFetched} />
                {/* // todo: tags section */}
            </div>
        </DashboardShell>
    )
}