'use client'

import { generateAvatarUrl } from "@/lib/tools"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface UserProps {
    user: {
        username: string,
        email: string,
        // admin: boolean,
        // gravatar: string
    }
}



export default function HeaderUser({ user }: UserProps) {

    const [expanded, setExpanded] = useState(false)

    const buttonRef = useRef<HTMLDivElement>()

    // if clicked outside of the dropdown, close it
    useEffect(() => {
        const close = (e: any) => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (expanded && !buttonRef?.current?.contains(e.target)) {
                setExpanded(false)
            }
        }

        document.addEventListener("mousedown", close)
        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", close)
        }
    }, [expanded])


    const pathname = usePathname()
    useEffect(() => {
        setExpanded(false)
    }, [pathname])



    return (
        // @ts-expect-error ref is valid?
        <div className="dropdown text-end" ref={buttonRef}>
            <a href="#" className="d-block text-white text-decoration-none dropdown-toggle"
                onClick={() => setExpanded(!expanded)}
                data-bs-toggle="dropdown" aria-expanded="false">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={generateAvatarUrl(user.email)} alt="icon" className="rounded-circle" width="32" height="32" />
                <span className="align-middle ps-1">@{user.username}</span>
            </a>
            {expanded && (
                <ul className="dropdown-menu text-small" style={{ display: "block" }} >
                    <li><a className="dropdown-item" href="/new">New item...</a></li>
                    <li><a className="dropdown-item" href="/settings">Settings</a></li>
                    <li><a className="dropdown-item" href="/user/@me">Profile</a></li>
                    {/* {user.admin && (
                        <li><a className="dropdown-item" href="#">Admin</a></li>
                    )} */}
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="/logout">Sign out</a></li>
                </ul>
            )}
        </div >

    )
}