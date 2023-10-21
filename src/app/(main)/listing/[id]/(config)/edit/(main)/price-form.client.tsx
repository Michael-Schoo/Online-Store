"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Listing } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { listingUpdateSchema } from "@/lib/validations/listing"
import { useState } from "react"


interface PriceFormProps {
    listing: Listing
}

type FormData = z.infer<typeof listingUpdateSchema>

export function PriceForm({ listing }: PriceFormProps) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(listingUpdateSchema.partial()),
        defaultValues: {
            price: listing?.price ?? undefined
        },
    })
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function onSubmit(data: FormData) {

        setIsSaving(true)

        const response = await fetch(`/api/listing/${listing.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        setIsSaving(false)

        if (!response?.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your information was not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your price has been updated.",
        })

        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Price</CardTitle>
                    <CardDescription>
                        Please set the price of listing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-1 space-y-2">
                        <Label className="sr-only" htmlFor="name">
                            Price
                        </Label>
                        <Input
                            id="price"
                            className="w-full sm:w-[400px]"
                            type="number"
                            min={0}
                            max={10_000}
                            size={50}
                            defaultValue={listing?.price ?? undefined}
                            {...register("price", { valueAsNumber: true })}
                        />
                        {errors?.price && (
                            <p className="px-1 text-xs text-red-600">{errors.price.message}</p>
                        )}

                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full md:w-auto"
                        disabled={isSaving}
                    >
                        {isSaving && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <span>Save</span>
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}