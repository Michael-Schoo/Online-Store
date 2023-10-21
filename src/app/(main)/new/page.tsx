import { Metadata } from "next"
import CreateListing from "./create-listing"

export default function ListingPage() {
    return <CreateListing />
}

export const metadata = {
    title: "New Listing",
    description: "Create a new listing",
    robots: {
        index: false,
        follow: false,
    }
} satisfies Metadata