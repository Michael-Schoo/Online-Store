'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormEvent, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { minWait, wait } from "@/lib/tools"
import { Loader2 } from "lucide-react"


export default function Login() {

    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)


    const login = async (email: string, password: string) => {
        setLoading(true)
        
        if (!email || !password) {
            await wait(500);
            setError(true)
            setLoading(false)
            return
        }

        const response = await minWait(500, () => fetch("/api/login", {
            body: JSON.stringify({
                email,
                password
            }),
            method: "POST"
        }));

        const data = await response.json()

        if (data.success) {
            document.location.href = "/"
        }

        else if (data.error) {
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
        <form onSubmit={handleAction} className="grid min-h-[calc(100vh-64.8px)] place-items-center">
            <Card className="w-96 m-10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="me@example.com"
                            className={error ? "invalid-input" : ""}
                            onChange={e => setError(false)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="********"
                            className={error ? "invalid-input" : ""}
                            onChange={e => setError(false)}
                        />
                    </div>

                    {error && (
                        <div className="text-destructive -mt-4">
                            Invalid email or password
                        </div>
                    )}

                </CardContent>
                <CardFooter>
                    <Button className="w-full" role="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>
                </CardFooter>
            </Card>


        </form>

        // // <main className="m-auto text-center" >
        // <main className="container pt-3 text-start">
        //     <form onSubmit={handleAction} className="needs-validation">
        //         <h1 className="h3 mb-3 fw-normal">Please login</h1>

        //         {/* email */}
        //         <div className="col-md-4">
        //             <label htmlFor="email">
        //                 Email address
        //             </label>

        //             <input type="email" className={`form-control ${error ? "is-invalid" : ""}`} id="email" required
        //                 onChange={e => setEmail(e.target.value)}
        //             />

        //             {error && (
        //                 <div className="invalid-feedback">
        //                     Invalid email or password
        //                 </div>
        //             )}


        //         </div>
        //         <br />

        //         {/* password */}
        //         <div className="col-md-4">
        //             <label htmlFor="password">
        //                 Password
        //             </label>

        //             <input type="password" className={`form-control ${error ? "is-invalid" : ''}`} id="password" required
        //                 onChange={e => setPassword(e.target.value)}
        //             />
        //             {error && (
        //                 <div className="invalid-feedback">
        //                     Invalid email or password
        //                 </div>
        //             )}

        //         </div>

        //         <br />
        //         <button className="btn btn-lg btn-primary" type="submit">Sign in</button>
        //     </form>
        // </main >
    )
}
