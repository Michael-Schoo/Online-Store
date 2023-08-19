import { Inter } from "next/font/google"
import Header from "@/components/Header"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            {/* <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]"> */}
                {children}
            {/* </div> */}
        </>
    )
}
