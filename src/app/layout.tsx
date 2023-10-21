import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import "./styles.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { ReactNode } from "react";

const fontSans = FontSans({
    subsets: ["latin"],
})

export const metadata = {
    title: {
        default: "Online Listings",
        template: "%s | Online Listings",
    },
    description: "A store/a place to list things?",
} satisfies Metadata

export default function RootLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <html lang="en">
            <body className={cn(
                "min-h-screen bg-background antialiased",
                fontSans.className,
            )}>
                {/* <Header />
                <main>{children}</main> */}
                {children}
                <Toaster />
            </body>
        </html>
    )
}
