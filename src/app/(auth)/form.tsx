"use client"

import { Input } from "@/components/ui/input"
import { FormEvent, useState } from "react"
import { Label } from "@/components/ui/label"
import { buttonVariants } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import GoogleIcon from "@/components/icons/Google"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isGoogleLoading, setGoogleLoading] = useState<boolean>(false)
    // const [errors]
    const { toast } = useToast()

    const login = async (email: string) => {
        setLoading(true)

        const response = await fetch("/api/login", {
            body: JSON.stringify({ email }),
            method: "POST",
        })
        setLoading(false)

        if (!response?.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your sign in request failed. Please try again.",
                variant: "destructive",
            })
        }

        return toast({
            title: "Check your email",
            description: "We sent you a login link. Be sure to check your spam too.",
        })
    }

    const handleAction = async (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        const email = (form.target as any).email.value as string
        await login(email)
    }

    const googleLogin = async () => {
        setGoogleLoading(true)
        toast({
            title: "Not set up...",
            description: "Google login isn't available yet...",
        })

        setTimeout(() => {
            console.log("google login")
            setGoogleLoading(false)
        }, 1000);
    }


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleAction}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            required
                        />
                        {/* {errors?.email && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )} */}
                    </div>
                    <button className={cn(buttonVariants())} disabled={isLoading}>
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In with Email
                    </button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }))}
                onClick={googleLogin}
                disabled={isLoading || isGoogleLoading}
            >
                {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <GoogleIcon className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </button>
        </div >
    )
}
