"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@prisma/client"
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
import { userUpdateSchema } from "@/lib/validations/user";
import type { getUser } from "../utils";


interface NameFormProps {
    user: NonNullable<Awaited<ReturnType<typeof getUser>>>
}

type FormData = z.infer<typeof userUpdateSchema>

export function NameForm({ user }: NameFormProps) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(listingUpdateSchema.partial()),
        defaultValues: {
            name: user?.name || "",
        },
    })
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function onSubmit(data: FormData) {

        setIsSaving(true)

        const response = await fetch(`/api/user/${user.id}`, {
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
                description: "Your name was not updated. Please try again.",
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
                    <CardTitle>Your Name</CardTitle>
                    <CardDescription>
                        Please enter your full name or a display name you are comfortable with.
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
                            size={32}
                            autoComplete="false"
                            defaultValue={user?.name || ""}
                            {...register("name")}
                        />
                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
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