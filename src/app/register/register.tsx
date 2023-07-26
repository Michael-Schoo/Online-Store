'use client'

import { emailRegex, passwordRegex, usernameRegex } from "@/lib/tools"
import { FormEvent, useEffect, useState } from "react"

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


export default function Register() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [usernameError, setUsernameError] = useState<string | false>(false)
    const [usernameValid, setUsernameValid] = useState<boolean | null | undefined>(undefined)

    // verify that the username is valid (not taken)
    const verifyUsername = async (username: string) => {
        setUsernameValid(null)
        setUsernameError(false)
        if (!username) return setUsernameValid(false)

        // check username regex first
        const regexValid = usernameRegex.test(username)
        if (!regexValid) {
            setUsernameError("Username must be between 3 and 20 characters long and can only contain letters, numbers and underscores")
            return setUsernameValid(false)
        }

        const response = await fetch(`/api/register/check-username?${new URLSearchParams({ username })}`)

        const data = await response.json()
        if (data.available) {
            return setUsernameValid(true)
        } else {
            setUsernameError("Username is already taken")
            return setUsernameValid(false)
        }
    }

    const [emailError, setEmailError] = useState<string | false>(false)
    const [emailValid, setEmailValid] = useState<boolean | null | undefined>(undefined)

    // verify that the email is valid (not taken)
    const verifyEmail = async (email: string) => {

        setEmailValid(null)
        setEmailError(false)
        if (!email) return setEmailValid(false)


        // check email regex first
        const regexValid = emailRegex.test(email)
        if (!regexValid) {
            setEmailError("Email is not valid")
            return setEmailValid(false)
        }

        const response = await fetch(`/api/register/check-email?${new URLSearchParams({ email })}`)

        const data = await response.json()
        if (data.available) {
            return setEmailValid(true)
        } else {
            setEmailError("Email is already taken")
            return setEmailValid(false)
        }
    }

    const [passwordError, setPasswordError] = useState<string | false>(false)

    // verify that the password is valid 
    const verifyPassword = async (password: string) => {
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

    useEffect(() => void verifyUsername(username), [username])
    useEffect(() => void verifyEmail(email), [email])
    useEffect(() => void verifyPassword(password), [password])

    const hasErrors = usernameError || emailError || passwordError
    const handleAction = async (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()

        if (!username) setUsernameError("You must enter a username")
        if (!email) setEmailError("You must enter an email")
        if (!password) setPasswordError("You must enter a password")
        if (hasErrors) return alert("Please fix the errors")


        const response = await fetch("/api/register", {
            body: JSON.stringify({
                username,
                email,
                password
            }),
            method: "POST"
        });

        const data = await response.json()

        if (data.success) {
            document.location.href = "/"
        }
    }


    // TODO: https://getbootstrap.com/docs/5.3/forms/validation/#server-side
    return (

        // <main className="m-auto text-center" >
        <main className="container pt-3 text-start">
            <form onSubmit={handleAction} className="needs-validation">
                <h1 className="h3 mb-3 fw-normal">Please register</h1>

                <div className="col-md-4">
                    {/* pattern="^[a-zA-Z0-9_]{3, 20}$" */}
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <div className={`input-group ${(usernameError || usernameValid) ? "has-validation" : ''}`}>
                        <span className="input-group-text" id="@">@</span>

                        <input type="text" className={`form-control ${usernameError ? "is-invalid" : usernameValid === true ? "is-valid" : ""}`} id="username" aria-describedby="@" required
                            onChange={e => setUsername(e.target.value)}
                        />

                        {usernameError && (
                            <div className="invalid-feedback">
                                {usernameError}
                            </div>
                        )}

                    </div>

                </div>
                <br />


                {/* email */}
                <div className="col-md-4">
                    <label htmlFor="email">
                        Email address
                    </label>

                    <input type="email" className={`form-control ${emailError ? "is-invalid" : emailValid === true ? "is-valid" : ""}`} id="email" required
                        onChange={e => setEmail(e.target.value)}
                    />

                    {emailError && (
                        <div className="invalid-feedback">
                            {emailError}
                        </div>
                    )}

                </div>
                <br />

                {/* password */}
                <div className="col-md-4">
                    <label htmlFor="password">
                        Password
                    </label>

                    <input type="password" className={`form-control ${passwordError ? "is-invalid" : password ? "is-valid" : ''}`} id="password" required
                        onChange={e => setPassword(e.target.value)}
                    />

                    {passwordError && (
                        <div className="invalid-feedback">
                            {passwordError}
                        </div>
                    )}

                </div>

                <br />
                <button className="btn btn-lg btn-primary" type="submit">Sign up</button>
            </form>
        </main >
    )
}


function Loading() {
    return (
        <div className="input-group-append" >
            <span className="input-group-text spinner-wrapper ">
                <div className="spinner-grow spinner-grow-sm text-primary" role="status" style={{ marginLeft: "-25px", marginTop: "10px", zIndex: 100 }}>
                    <span className="sr-only d-none">Loading...</span>
                </div>
            </span>
        </div>
    )

}

