export async function GET(request: Request) {
    return new Response(null, {
        status: 302,
        headers: {
            location: "/",
            "Set-Cookie":
                "token=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        },
    })
}
