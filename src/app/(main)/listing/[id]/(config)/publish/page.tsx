import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import prisma from "@/lib/prisma"
import { getListing } from "../utils"
import { listingUpdateSchema } from "@/lib/validations/listing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExternalLinkIcon } from "lucide-react"
import { PublishModal } from "./modal.client"
import { Metadata } from "next";

export const metadata = {
    title: "Publish",
    description: "Publish your listing and do a final check.",
} satisfies Metadata

export default async function SettingsPage({
    params: { id },
}: {
    params: { id: string }
}) {

    const user = await getCurrentUser()

    const listing = await getListing(id, user?.id ?? '')

    if (!listing || user?.id !== listing?.userId) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    if (listing.published) {
        redirect(`/listing/${id}`)
    }

    const [images, tags] = await Promise.all([
        prisma.listingImage.findMany({
            where: {
                listingId: id
            }
        }),

        // todo: tags
        []
    ]);

    const parsed = listingUpdateSchema.safeParse({
        name: listing.name,
        description: listing.description || '',
        price: listing.price,
        images,
        tags
    })

    const errors = parsed.success == false ? parsed.error.formErrors.fieldErrors : null;

    const customErrors = {
        'Name (5-50 chars)': { required: errors?.name },
        'Description (10-500 chars)': { required: errors?.description },
        'Price ($0 to $10,000)': { required: errors?.price },
        'Images (0-10)': { required: images.length > 10 ? "Too many images" : null, recommended: images.length === 0 ? "Recommended to have at least have one image" : null },
    }

    const hasErrors = Object.values(customErrors).some(v => v.required)

    return (
        <DashboardShell>
            <DashboardHeader
                heading={metadata.title}
                text={metadata.description}
            />
            <div className="grid gap-10">
                {/* checklist of all requirements */}
                {/* allows the user to check the "unlisted" version */}
                <Card>
                    <CardHeader>
                        <CardTitle>Final Check</CardTitle>
                        <CardDescription>
                            Makes sure you have filled out the required and recommended fields.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid gap-1">
                            {Object.entries(customErrors).map(([key, value]) => (
                                <li key={key} className="flex items-center space-x-2">
                                    <p
                                        className={cn(
                                            'accent-green-600 border-green-600 before:checked:bg-green-600',
                                            // @ts-expect-error type isn't here...
                                            value?.recommended && "border-yellow-600 accent-yellow-600 before:checked:bg-yellow-600",
                                            value.required && "border-red-600 accent-red-600 before:checked:bg-red-600",
                                            "border-2 rounded-sm"
                                        )}
                                        // @ts-expect-error type isn't here...
                                        title={value.required || value.recommended || undefined}
                                    >
                                        {/* @ts-expect-error type isn't here... */}
                                        {value.required ? "❕" : value.recommended ? "❔" : "✅"}
                                    </p>
                                    <span>{key}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-2 mt-2 flex-row">
                            <PublishModal listing={listing.id} name={listing.name} disabled={hasErrors} />

                            {/* button link for opening listing in new tab */}
                            <Button asChild variant="secondary" className="gap-2 pr-3">
                                <Link href={`/listing/${listing.id}`} target="_blank">
                                    View Listing <ExternalLinkIcon className="w-3.5" />
                                </Link>
                            </Button>

                        </div>

                    </CardContent>
                </Card>

            </div>
        </DashboardShell >
    )
}