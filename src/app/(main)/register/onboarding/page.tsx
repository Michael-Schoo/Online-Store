import { Metadata } from "next"
import ChooseNameClient from "./choose-name.client"
import {getCurrentUser} from "@/lib/session";
import {redirect} from "next/navigation";
import {authOptions} from "@/lib/auth";

export default async function ListingPage() {
    const user = await getCurrentUser()
    if (!user) return redirect(authOptions?.pages?.signIn || "/login")

    const name = user.name || user.email?.split('@')[0] || ''

    // TODO: not only show customise name but more onboarding steps (ie welcome msg)

    return <ChooseNameClient name={name} id={user.id} />
}

export const metadata = {
    title: "Onboarding",
    description: "Hello 👋",
    robots: {
        index: false,
        follow: false,
    }
} satisfies Metadata