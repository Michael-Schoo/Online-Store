import prisma from "@/lib/prisma"
import HeaderItem from "./HeaderItem"
import HeaderUser from "./HeaderUser"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function Header() {

    const currentUserId = cookies().get("token")

    const currentUser = currentUserId && await prisma.user.findUnique({
        where: {
            id: parseInt(currentUserId.value)
        },
        select: {
            username: true,
            email: true,
        }
    })

    console.log({ currentUser, currentUserId })

    return (
        <header className="p-3 text-bg-dark">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">

                        </svg>
                    </a>

                    <HeaderItem />

                    {currentUser ? (
                        <HeaderUser user={currentUser} />
                    ) : (
                        <div className="text-end">
                            <a type="button" className="btn btn-outline-light me-2" href="/login">Login</a>
                            <Link type="button" className="btn btn-warning" href="/register">Sign-up</Link>
                        </div>
                    )}


                </div>
            </div>
        </header>
    )

}