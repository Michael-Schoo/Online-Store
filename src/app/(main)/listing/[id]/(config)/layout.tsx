import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { DashboardNav, SidebarNavItem } from "@/components/Nav"
import { BarChart2Icon, CheckCheckIcon, FileImage, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Metadata } from "next"
import { metadata as rootMetadata } from "@/app/layout"
import { getListing } from "./utils"

interface DashboardLayoutProps {
    children?: React.ReactNode,
    params: { id: string }
}

const siteName = (rootMetadata!.title as { default: string })!.default

export async function generateMetadata({params}: {params: {id: string}}) {
    const user = await getCurrentUser()
    const listing = await getListing(params.id, user?.id ?? '')
    if (!listing) return notFound()

    return {
        title: {
            template: `%s | ${listing.name} | ` + siteName,
            default: `${listing.name} | ` + siteName
        },
        robots: {
            index: false
        }
    } satisfies Metadata
}

export default async function DashboardLayout({
    children,
    params: { id },
}: DashboardLayoutProps) {
    const user = await getCurrentUser()
    if (!user) {
        return notFound()
    }

    const listing = await getListing(id, user.id)
    if (!listing) return notFound()

    const dashboardConfig: SidebarNavItem[] = [
        {
            title: "Information",
            href: `/listing/${id}/edit`,
            icon: <Settings />,
        },
        {
            title: "Images",
            href: `/listing/${id}/edit/images`,
            icon: <FileImage />,
        },
        {
            title: "Analytics",
            href: `/listing/${id}/analytics`,
            icon: <BarChart2Icon />,
            disabled: !listing.published,
        },
        {
            title: "Publish",
            href: `/listing/${id}/publish`,
            icon: <CheckCheckIcon />,
            disabled: listing.published,
        },
    ]


    return (

        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] mt-6">
            {/* // todo: better mobile support */}
            <aside className="hidden md:flex">
                <div className="fixed w-[200px]">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h2 className="text-lg truncate mb-3">{listing?.name}</h2>
                            </TooltipTrigger>
                            <TooltipContent className="text-sm">
                                {listing?.name}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {/* // todo: show listing name on-top */}
                    <DashboardNav items={dashboardConfig} />
                </div>
            </aside>
            <main className="flex w-full flex-1 flex-col overflow-hidden mb-10">
                {children}
            </main>
        </div>
        // <SiteFooter className="border-t" />
    )
}