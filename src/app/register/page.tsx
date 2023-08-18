// import { register } from './actions'
import Register from "./register"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/user"

// Server action defined inside a Server Component
export default async function RegisterPage() {
    const currentUser = await getCurrentUser()
    if (currentUser) {
        return redirect("/")
    }

    return <Register />
}
