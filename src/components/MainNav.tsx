"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useState } from "react"
import LogoIcon from "./icons/Logo"
import CloseIcon from "./icons/Close"
import { useLockBody } from "./hooks/use-lock-body"
import Arrow from "./icons/Arrow"
import { Search } from "./Search"

const siteName = "Web Lister"

const items = [
    // { url: "/", text: "Home" },
    { url: "#saved", text: "Saved" },
    { url: "#categories", text: "Categories" },
    { url: "/new", text: "New" },
    // { url: "#items", text: "All Listings" },
]

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const path = usePathname()

    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)

    return (
        <>
            <nav
                className={cn(
                    "flex items-center",
                    className,
                )}
                {...props}
            >
                <Link
                    className="hidden items-center space-x-2 me-8 md:flex"
                    href="/"
                >
                    <LogoIcon />
                    <span className="inline-block whitespace-nowrap font-bold">
                        {siteName}
                    </span>
                </Link>

                <button
                    className="flex items-center space-x-2 md:hidden"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    {showMobileMenu ? <CloseIcon /> : <LogoIcon />}
                    <span className="inline-block font-bold">
                        {showMobileMenu ? "Close Menu" : siteName}
                    </span>

                    <Arrow
                        className={cn(
                            "transform transition-transform",
                            showMobileMenu ? "-rotate-180" : "",
                        )}
                    />
                </button>

                <div className="hidden gap-6 text-sm md:flex md:items-center">
                    {items.map((item) => (
                        // <HeaderLink key={item.url} url={item.url} text={item.text} />
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                "text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                                path !== item.url
                                    ? "text-foreground/60"
                                    : "text-foreground",
                            )}
                        >
                            {item.text}
                        </Link>
                    ))}
                </div>
            </nav>
            {showMobileMenu && (
                <MobileHeader close={() => setShowMobileMenu(false)} />
            )}
        </>
    )
}

function MobileHeader({ close }: { close: () => void }) {
    useLockBody()
    const path = usePathname()
    return (
        <div
            className={cn(
                "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
            )}
        >
            <div className="relative z-20 grid gap-6 rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
                <Link href="/" className="flex items-center space-x-2" onClick={close}>
                    <LogoIcon />
                    <span className="whitespace-nowrap font-bold">
                        {siteName}
                    </span>
                </Link>

                <nav className="grid grid-flow-row auto-rows-max text-sm">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            href={item.url}
                            className={cn(
                                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                                path === item.url && "font-bold",
                            )}
                            onClick={close}
                        >
                            {item.text}
                        </Link>
                    ))}
                </nav>
                <Search className="w-full" />
            </div>
        </div>
    )
}
