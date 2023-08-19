import { getCurrentUser } from "@/lib/user"
import { MainNav } from "./MainNav"
import { Search } from "./Search"
import { UserNav, SignedOutUserNav } from "./UserNav"

export default async function Header() {
    const currentUser = await getCurrentUser()

    return (
        <div className="sticky flex items-center justify-between border-b top-0 z-40 bg-background">
            <header className="flex h-16 w-full items-center container">
                <MainNav className="w-full md:w-auto lg:w-1/3" />
                <div className="hidden w-full md:mx-10 md:flex lg:w-1/3 lg:justify-center">
                    <Search className="relative w-full max-w-[350px] lg:w-80 lg:max-w-[450px] xl:w-full" />
                </div>
                <div className="flex justify-end lg:w-1/3">
                    {currentUser ? (
                        <UserNav user={currentUser} />
                    ) : (
                        <SignedOutUserNav />
                    )}
                </div>
            </header>
        </div>
    )
}
