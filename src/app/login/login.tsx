'use client'

import { FormEvent, useEffect, useState } from "react"

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


export default function Login() {

    // const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<boolean>(false)


    useEffect(() => void login(email, password), [email, password])

    const login = async (email: string, password: string) => {
        if (!email || !password) return setError(true)

        const response = await fetch("/api/login", {
            body: JSON.stringify({
                email,
                password
            }),
            method: "POST"
        });

        const data = await response.json()

        if (data.success) {
            document.location.href = "/"
        }

        else if (data.error) {
            setError(true)
        }
    }

    const handleAction = async (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        await login(email, password)
        if (error) return alert("Please enter you email and password")
    }


    // TODO: https://getbootstrap.com/docs/5.3/forms/validation/#server-side
    return (

        // <main className="m-auto text-center" >
        <main className="container pt-3 text-start">
            <form onSubmit={handleAction} className="needs-validation">
                <h1 className="h3 mb-3 fw-normal">Please login</h1>

                {/* email */}
                <div className="col-md-4">
                    <label htmlFor="email">
                        Email address
                    </label>

                    <input type="email" className={`form-control ${error ? "is-invalid" : ""}`} id="email" required
                        onChange={e => setEmail(e.target.value)}
                    />

                    {error && (
                        <div className="invalid-feedback">
                            Invalid email or password
                        </div>
                    )}


                </div>
                <br />

                {/* password */}
                <div className="col-md-4">
                    <label htmlFor="password">
                        Password
                    </label>

                    <input type="password" className={`form-control ${error ? "is-invalid" : ''}`} id="password" required
                        onChange={e => setPassword(e.target.value)}
                    />
                    {error && (
                        <div className="invalid-feedback">
                            Invalid email or password
                        </div>
                    )}

                </div>

                <br />
                <button className="btn btn-lg btn-primary" type="submit">Sign up</button>
            </form>
        </main >
    )
}
