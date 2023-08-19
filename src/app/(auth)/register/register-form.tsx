"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { emailRegex, minWait, passwordRegex, usernameRegex } from "@/lib/tools"
import { FormEvent, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [usernameError, setUsernameError] = useState<string | false>(false)
    const [usernameValid, setUsernameValid] = useState<
        boolean | null | undefined
    >(undefined)

    // verify that the username is valid (not taken)
    const verifyUsername = async (u?: string) => {
        setUsernameValid(null)
        setUsernameError(false)
        if (!username) return setUsernameValid(false)

        // check username regex first
        const regexValid = usernameRegex.test(username)
        if (!regexValid) {
            setUsernameError(
                "Username must be between 3 and 20 characters long and can only contain letters, numbers and underscores",
            )
            return setUsernameValid(false)
        }

        const response = await fetch(
            `/api/register/check-username?${new URLSearchParams({ username })}`,
        )

        const data = await response.json()
        if (data.available) {
            if (data.username == username) {
                return setUsernameValid(true)
            } else {
                console.log("changed input")
            }
        } else {
            setUsernameError("Username is already taken")
            return setUsernameValid(false)
        }
    }

    const [emailError, setEmailError] = useState<string | false>(false)
    const [emailValid, setEmailValid] = useState<boolean | null | undefined>(undefined)

    // verify that the email is valid (not taken)
    const verifyEmail = async (e?: string) => {
        setEmailValid(null)
        setEmailError(false)
        if (!email) return setEmailValid(false)

        // check email regex first
        const regexValid = emailRegex.test(email)
        if (!regexValid) {
            setEmailError("Email is not valid")
            return setEmailValid(false)
        }

        const response = await fetch(
            `/api/register/check-email?${new URLSearchParams({ email })}`,
        )

        const data = await response.json()
        if (data.available) {
            if (data.email == email) {
                return setEmailValid(true)
            }
        } else {
            setEmailError("Email is already taken")
            return setEmailValid(false)
        }
    }

    const [passwordError, setPasswordError] = useState<string | false>(false)

    // verify that the password is valid
    const verifyPassword = async (p?: string) => {
        setPasswordError(false)
        if (!password) return
        // check password regex
        const regexValid = passwordRegex.test(password)
        if (!regexValid) {
            setPasswordError("Password must be at least 8 characters long")
        } else {
            setPasswordError(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => void verifyUsername(username), [username])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => void verifyEmail(email), [email])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => void verifyPassword(password), [password])

    const [loading, setLoading] = useState(false)

    const hasErrors = usernameError || emailError || passwordError
    const handleAction = async (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()

        if (!username) setUsernameError("You must enter a username")
        if (!email) setEmailError("You must enter an email")
        if (!password) setPasswordError("You must enter a password")
        // if (hasErrors) return alert("Please fix the errors")
        setLoading(true)

        const response = await minWait(500, () =>
            fetch("/api/register", {
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
                method: "POST",
            }),
        )

        const data = await response.json()
        setLoading(false)

        if (data.success) {
            router.push("/")
            router.refresh()
        }
    }

    // TODO: https://getbootstrap.com/docs/5.3/forms/validation/#server-side
    return (
        <form onSubmit={handleAction} className="grid gap-6">
            <div className="grid gap-2 space-y-2">
                <div className="grid gap-2 space-y-2">
                    <div className="grid gap-1">
                        <Label htmlFor="displayname">Username</Label>
                        <Input
                            id="displayname"
                            type="displayname"
                            placeholder="@username"
                            disabled={loading}
                            // autoCapitalize="none"
                            // autoCorrect="off"
                            onChange={(e) => setUsername(e.target.value)}
                            className={
                                usernameError
                                    ? "invalid-input"
                                    : usernameValid
                                        ? "valid-input"
                                        : ""
                            }
                        />
                        {usernameError && (
                            <p className="text-sm text-red-600">
                                {usernameError}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="me@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            className={
                                emailError ? "invalid-input" : emailValid ? "valid-input" : ""
                            }
                        />
                        {emailError && (
                            <p className="text-sm text-red-600">
                                {emailError}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            className={passwordError ? "invalid-input" : ""}
                        />
                        {passwordError && (
                            <p className="text-sm text-red-600">
                                {passwordError}
                            </p>
                        )}
                    </div>
                </div>
                <Button className="w-full" role="submit" disabled={loading}>
                    {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign Up
                </Button>
            </div>
        </form>
    )
}

function Loading() {
    return (
        <div className="input-group-append">
            <span className="input-group-text spinner-wrapper ">
                <div
                    className="spinner-grow spinner-grow-sm text-primary"
                    role="status"
                    style={{
                        marginLeft: "-25px",
                        marginTop: "10px",
                        zIndex: 100,
                    }}
                >
                    <span className="d-none sr-only">Loading...</span>
                </div>
            </span>
        </div>
    )
}
