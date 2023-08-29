import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import "./styles.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

const fontSans = FontSans({
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Online Store",
    description: "A store?",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
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
