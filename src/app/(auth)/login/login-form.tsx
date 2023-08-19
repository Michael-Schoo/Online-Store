"use client"

import { Input } from "@/components/ui/input"
import { FormEvent, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { minWait, wait } from "@/lib/tools"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const login = async (email: string, password: string) => {
        setLoading(true)

        if (!email || !password) {
            await wait(500)
            setError(true)
            setLoading(false)
            return
        }

        const response = await minWait(500, () =>
            fetch("/api/login", {
                body: JSON.stringify({
                    email,
                    password,
                }),
                method: "POST",
            }),
        )

        const data = await response.json()

        if (data.success) {
            // document.location.href = "/"
            // get redirect param
            const redirect =
                new URLSearchParams(document.location.search).get("from") ||
                "/"
            router.push(redirect)
            router.refresh()
        } else if (data.error) {
            setError(true)
            setLoading(false)
        }
    }

    const handleAction = async (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        const email = (form.target as any).email.value as string
        const password = (form.target as any).password.value as string
        await login(email, password)
    }

    return (

        <form onSubmit={handleAction} className="grid gap-6">
            <div className="grid gap-2 space-y-2">
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="me@example.com"
                            className={error ? "invalid-input" : ""}
                            disabled={loading}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            onChange={(e) => setError(false)}
                        />
                    </div>

                    <div className="grid gap-2 pt-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            className={error ? "invalid-input" : ""}
                            disabled={loading}
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            onChange={(e) => setError(false)}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 mt-0">
                            Invalid email or password
                        </div>
                    )}
                </div>

                <Button className="w-full" role="submit" disabled={loading}>
                    {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In
                </Button>
            </div>
        </form>

    )
}
