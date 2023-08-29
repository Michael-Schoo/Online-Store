import { NextResponse } from "next/server"

export const revalidate = 0

export async function GET(request: Request) {
    const url = new URL(request.url)
    const jwt = url.searchParams.get("jwt")
    const expires = url.searchParams.get("expires")
    const expiredDate = new Date(expires || 0)
    console.log(expiredDate)
    url.search = ''
    
    if (!jwt || Date.now() > expiredDate.getTime()) {
        url.pathname = "/login"
        return NextResponse.redirect(url.toString(), { status: 302 })
    }

    // make that the token the cookie an return to home
    url.pathname = "/"
    return NextResponse.redirect(url.toString(), {
        headers: {
            "Set-Cookie": `token=${jwt}; path=/; expires=${expiredDate.toUTCString()};`,
        },
    })
}