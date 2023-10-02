import { Card } from "@/components/ui/card"
import { CardSkeleton } from "@/components/CardSkeleton"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { metadata } from "./page"

export default function DashboardSettingsLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading={metadata.title}
                text={metadata.description}
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}