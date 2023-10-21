import {getCurrentUser} from "@/lib/session";
import {redirect} from "next/navigation";


export default async function ProfilePage() {
    const user = await getCurrentUser()
    if (user) {
        redirect(`/user/${user.id}`)
    } else {
        redirect("/login")
    }

    return null
}