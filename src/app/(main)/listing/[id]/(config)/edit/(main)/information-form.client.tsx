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
import { Textarea } from "@/components/ui/textarea"
import { getListing } from "@/app/(main)/listing/[id]/(config)/utils";


interface InformationFormProps {
    listing: NonNullable<Awaited<ReturnType<typeof getListing>>>
}

type FormData = z.infer<typeof listingUpdateSchema>

export function InformationForm({ listing }: InformationFormProps) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(listingUpdateSchema.partial()),
        defaultValues: {
            name: listing.name || "",
            description: listing.description || "",
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
            description: "Your name has been updated.",
        })

        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Please enter the name and description of your listing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-1 space-y-2">
                        <Label className="sr-only" htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="name"
                            className="w-full sm:w-[400px]"
                            size={50}
                            defaultValue={listing?.name || ""}
                            {...register("name")}
                        />
                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                        )}

                        <Label className="sr-only" htmlFor="name">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Enter the description..."
                            className="w-full sm:w-[400px]"
                            defaultValue={listing?.description || ""}
                            {...register("description")}
                        />
                        {errors?.description && (
                            <p className="px-1 text-xs text-red-600">{errors.description.message}</p>
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