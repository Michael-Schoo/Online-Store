'use client'

import { usePathname } from "next/navigation"

export default function HeaderItem() {

    return (
        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <HeaderButton url="/" text="Home" />
            <HeaderButton url="/items" text="Items" />
            <HeaderButton url="/about" text="About" />
        </ul>

    )
}

function HeaderButton({ url, text }: { url: string, text: string }) {
    const path = usePathname()

    return (
        <li>
            <a href={url} className={`nav-link px-2 ${path === url ? 'text-secondary' : 'text-white'} `}>
                {text}
            </a>
        </li>

    )
}