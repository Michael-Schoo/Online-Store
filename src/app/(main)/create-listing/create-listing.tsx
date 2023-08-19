"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ListingInfoBasic from "./basic-listing-config"
import { useState } from "react"
import ListingReview from "./review-listing"
import UploadImages from "./upload-images"

// Requirements
// - name
// - description
// - price (with currency selector)
// - tags (autocomplete)
// - images (urls) TODO: allow upload

export interface Data {
    name: string
    description: string
    price: number | null
    currency: string
    tags: string[]
    images: string[]
}

export default function CreateListing() {
    // const [listingId, setListingId] = useState<string | null>(null)
    const dataState = useState<Data>({
        name: "",
        description: "",
        price: null,
        currency: "USD",
        tags: ["Default tag :)"],
        images: [],
    })

    const [tab, setTab] = useState<string>("basic")

    return (
        <div className="grid place-items-center p-4">
            <Tabs
                defaultValue="basic"
                value={tab}
                className="w-full sm:w-[400px]"
            >
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic" onClick={() => setTab("basic")}>
                        Information
                    </TabsTrigger>
                    <TabsTrigger
                        id="create-listing:images-tab"
                        value="images"
                        onClick={() => setTab("images")}
                    >
                        Images
                    </TabsTrigger>
                    <TabsTrigger
                        value="review"
                        onClick={() => setTab("review")}
                    >
                        Review
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                    <ListingInfoBasic data={dataState} setTab={setTab} />
                </TabsContent>
                <TabsContent value="images">
                    <UploadImages data={dataState} setTab={setTab} />
                </TabsContent>
                <TabsContent value="review">
                    <ListingReview data={dataState} setTab={setTab} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
