import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function GET(request: Request) {
    // headers().delete("token")
    // return redirect("/")

    const requestHeaders = new Headers(request.headers)
    // requestHeaders.delete("token")

    return new Response(null,  {
        status: 302,
        headers: { 
            location: "/",
            'Set-Cookie': 'token=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
    })
}