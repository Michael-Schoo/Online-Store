import { getCurrentUser } from "@/lib/user"
import { MainNav } from "./MainNav"
import { Search } from "./Search"
import { UserNav, SignedOutUserNav } from "./UserNav"

export default async function Header() {
    const currentUser = await getCurrentUser()

    return (
        <div className="hidden flex-col md:flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <a className="mr-6 flex items-center space-x-2" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6">
                            <rect width="256" height="256" fill="none"></rect>
                            <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="16"></line>
                            <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="16"></line>
                        </svg>
                        <span className="hidden font-bold sm:inline-block">Web Store</span></a>
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <Search />
                        {currentUser ? (
                            <UserNav user={currentUser} />
                        ) : (
                            <SignedOutUserNav />
                        )}
                    </div>
                </div>
            </div>
        </div>

    )

}