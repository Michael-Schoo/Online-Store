import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { generateAvatarUrl } from "@/lib/tools"
import Link from "next/link"

interface UserProps {
    user: {
        username: string
        email: string
        // admin: boolean,
        // gravatar: string
    }
}

function getInitials(username: string) {
    // first 2 characters of username
    return username.slice(0, 2).toUpperCase()
}

export function UserNav({ user }: UserProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full p-2"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={generateAvatarUrl(user.email)}
                            alt={`@${user.username}`}
                        />
                        <AvatarFallback>
                            {getInitials(user.username)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            @{user.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Purchases</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/create-listing" className="cursor-pointer">
                            New Listing
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <a href="/logout" className="cursor-pointer">
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function SignedOutUserNav() {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full p-2"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Not signed in
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                Sign in to access your purchases
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/login">Sign in</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-semibold" asChild>
                            <Link href="/register">Sign up</Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* <Button variant="secondary" asChild>
                <Link href="/login">
                    Login
                </Link>
            </Button> */}
        </>
    )
}
