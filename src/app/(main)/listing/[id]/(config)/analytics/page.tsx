import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import prisma from "@/lib/prisma"
import AnalyticsGraph from "./graph.client"
import { getListing } from "../utils"


export const metadata = {
    title: "Analytics",
    description: "See analytics for your listing.",
}

export default async function SettingsPage({
    params: { id },
}: {
    params: { id: string }
}) {

    const user = await getCurrentUser()

    const listing = await getListing(id, user?.id ?? '')

    if (!listing || user?.id !== listing?.userId) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const analytics = await prisma.listingAnalytics.findMany({
        where: {
            listingId: id
        },
        orderBy: {
            day: 'asc'
        }
    }) as { day: Date, views: number }[];

    const startDate = listing.publishedAt || analytics?.[0]?.day || new Date();
    const currentDate = new Date();

    // clone it
    let checkDate = new Date(startDate.valueOf());

    // fill in the gaps
    while (checkDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) {
        checkDate.setDate(checkDate.getDate() + 1);
        if (analytics.find(item => item.day.getTime() === checkDate.getTime())) continue;

        analytics.push({
            day: new Date(checkDate),
            views: 0
        });
    }

    const chartdata = analytics
        .sort((a, b) => a.day.getTime() - b.day.getTime())
        .map((item, index) => ({
            day: item.day.toISOString().split('T')[0],
            'Page Visits': item.views
        }));

    console.log(chartdata)

    return (
        <DashboardShell>
            <DashboardHeader
                heading={metadata.title}
                text={metadata.description}
            />
            <div className="grid gap-10">
                {/* something */}
                <AnalyticsGraph chartData={chartdata} />
            </div>
        </DashboardShell>
    )
}