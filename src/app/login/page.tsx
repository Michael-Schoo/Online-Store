import { redirect } from "next/navigation"
import Login from "./login"
import { getCurrentUser } from "@/lib/user"

export default async function LoginPage() {
    const currentUser = await getCurrentUser()
    if (currentUser) {
        return redirect("/")
    }

    return <Login />
}
