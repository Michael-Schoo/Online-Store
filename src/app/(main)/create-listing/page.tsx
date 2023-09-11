import { redirect } from "next/navigation"
import CreateListing from "./create-listing"
import { getCurrentUser } from "@/lib/session"
import { authOptions } from "@/lib/auth"

export default async function ListingPage() {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return redirect((authOptions?.pages?.signIn || "/login") + "?from=/create-listing")
    }

    return <CreateListing />
}
