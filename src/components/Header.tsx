import { getCurrentUser } from "@/lib/user"
import { MainNav } from "./MainNav"
import { Search } from "./Search"
import { UserNav, SignedOutUserNav } from "./UserNav"

export default async function Header() {
    const currentUser = await getCurrentUser()

    return (
        <header className="flex-col flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <MainNav className="mx-6 hidden md:block" />
                    <div className=" w-full hidden md:block align-middle text-centre">
                        <Search className="ml-[25%]" />
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                        {currentUser ? (
                            <UserNav user={currentUser} />
                        ) : (
                            <SignedOutUserNav />
                        )}
                    </div>
                </div>
            </div>
        </header>

    )

}