import {notFound, redirect} from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { DashboardNav, SidebarNavItem } from "@/components/Nav"
import {FileTextIcon, Settings, ShoppingCart, UserIcon} from "lucide-react"
import { getUser } from "@/app/(main)/(settings)/utils";
import { authOptions } from "@/lib/auth";

interface DashboardLayoutProps {
    children?: React.ReactNode,
    params: { id: string }
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const user = await getCurrentUser()
    if (!user) {
        return redirect(authOptions?.pages?.signIn || "/login")
    }

    const fetchedUser = await getUser(user.id)
    if (!fetchedUser) return notFound()

    const dashboardConfig: SidebarNavItem[] = [
        {
            title: "Your Profile",
            href: `/user/${fetchedUser.id}`,
            icon: <UserIcon />,
        },
        {
            title: "Dashboard",
            href: `/dashboard`,
            icon: <FileTextIcon />,
        },
        {
            title: "Purchase History",
            href: `/purchases`,
            icon: <ShoppingCart  />,
        },
        {
            title: "Settings",
            href: `/settings`,
            icon: <Settings />,
        },
    ]


    return (

        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] mt-6">
            {/* // todo: better mobile support */}
            <aside className="hidden md:flex">
                <div className="fixed w-[200px]">
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