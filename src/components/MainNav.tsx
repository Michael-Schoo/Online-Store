"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <HeaderLink url="/" text="Home" />
            <HeaderLink url="#" text="Items" />
            <HeaderLink url="#" text="About" />
        </nav>
    )
}

function HeaderLink({ url, text }: { url: string, text: string }) {
    const path = usePathname()

    let className = "text-sm font-medium transition-colors hover:text-primary"
    if (path !== url) {
        className = cn(className, "text-muted-foreground")
    }

    return (
        <Link
            href={url}
            className={className}
        >
            {text}
        </Link>
    )
}
