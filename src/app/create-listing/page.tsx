import { getCurrentUser } from '@/lib/user'
import {  redirect } from 'next/navigation'
import CreateListing from './create-listing'

export default async function ListingPage() {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return redirect("/login?redirect=/create-listing")
    }

    return (
        <CreateListing />
    )
}

