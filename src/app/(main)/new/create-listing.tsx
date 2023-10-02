'use client';

// file with only one text box for name
// submit creates it and redirects to the listing page

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from '@/components/ui/use-toast';
import { listingCreateSchema } from '@/lib/validations/listing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

type FormData = z.infer<typeof listingCreateSchema>


export default function CreateListing() {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(listingCreateSchema),
    })

    const [isCreating, setIsCreating] = useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsCreating(true)

        const response = await fetch(`/api/listing`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
            }),
        })

        if (!response.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your sign in request failed. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            title: "Created Listing!",
            description: "Please fill out the rest of the information.",
        })

        const listing = await response.json()

        router.push(`/listing/${listing.id}/edit`)
    }

    return (
        <main>
            <form onSubmit={handleSubmit(onSubmit)} className="container flex justify-center items-center mt-12">
                <Card className="sm:w-fit w-full">
                    <CardHeader>
                        <CardTitle>Create Listing</CardTitle>
                        <CardDescription>
                            Please enter the name of your listing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="name">
                                Name
                            </Label>
                            <Input
                                id="name"
                                className="sm:w-[400px] w-full"
                                size={32}
                                {...register("name")}
                            />
                            {errors?.name && (
                                <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="md:float-right">
                        <Button
                            type="submit"
                            className="w-full md:w-auto"
                            disabled={isCreating}
                        >
                            {isCreating && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Create</span>
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </main>
    )

}
