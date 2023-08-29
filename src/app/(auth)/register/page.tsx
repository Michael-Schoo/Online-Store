// import { register } from './actions'
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/user"
import { Metadata } from "next"
import Link from "next/link"
import Logo from "@/components/icons/Logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import { UserAuthForm } from "../form"

// Server action defined inside a Server Component
export default async function RegisterPage() {
    const currentUser = await getCurrentUser()
    if (currentUser) {
        return redirect("/")
    }

    return (
        <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-4 top-4 md:left-8 md:top-8"
                )}
            >
                <>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                </>
            </Link>

            <Link
                href="/login"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute right-4 top-4 md:right-8 md:top-8"
                )}
            >
                Login
            </Link>
            
            <div className="hidden h-full bg-muted lg:block" />
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <Logo className="mx-auto h-6 w-6" />
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to create your account
                        </p>
                    </div>
                    {/* the actual sign up part */}
                    <UserAuthForm />

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="hover:text-brand underline underline-offset-4"
                            // TODO: add this page
                            prefetch={false}
                        >
                            Terms of Service
                        </Link>
                        {" and "}
                        <Link
                            href="/privacy"
                            className="hover:text-brand underline underline-offset-4"
                            // TODO: add this page
                            prefetch={false}
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}
