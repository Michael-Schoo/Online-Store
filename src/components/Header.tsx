import { getCurrentUser } from "@/lib/user"
import { MainNav } from "./MainNav"
import { Search } from "./Search"
import { UserNav, SignedOutUserNav } from "./UserNav"

export default async function Header() {
    const currentUser = await getCurrentUser()

    return (
        <nav className="relative flex items-center justify-between border-b">
            <div className="flex w-full h-16 items-center px-4">
                <MainNav className="w-full md:w-1/3" />
                <div className="hidden justify-center md:flex md:w-1/3">
                    <Search className="max-w-[450px] relative w-full lg:w-80 xl:w-full" />
                </div>
                <div className="flex justify-end md:w-1/3">
                    {currentUser ? (
                        <UserNav user={currentUser} />
                    ) : (
                        <SignedOutUserNav />
                    )}
                </div>
            </div>
        </nav>

    )

}