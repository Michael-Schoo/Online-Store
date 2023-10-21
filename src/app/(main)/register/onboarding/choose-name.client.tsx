'use client';
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
import {userUpdateSchema} from "@/lib/validations/user";

type FormData = z.infer<typeof userUpdateSchema>

interface ChooseNameFormProps {
    name: string,
    id: string
}


export default function ChooseNameClient({name, id}: ChooseNameFormProps) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(listingCreateSchema),
        defaultValues: {
            name: name,
        }
    })

    const [isUpdating, setIsUpdating] = useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsUpdating(true)

        const response = await fetch(`/api/user/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your name was not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your name has been updated.",
        })

        // todo: use query param to know where to go
        router.push(`/`)
        router.refresh()
    }

    return (
        <main>
            <form onSubmit={handleSubmit(onSubmit)} className="container flex justify-center items-center mt-12">
                <Card className="sm:w-fit w-full">
                    <CardHeader>
                        <CardTitle>Your Name</CardTitle>
                        <CardDescription>
                            Please enter your full name or a display name you are comfortable with.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="name">
                                Name
                            </Label>
                            <Input
                                id="name"
                                className="w-full sm:w-[400px]"
                                size={32}
                                autoComplete="false"
                                defaultValue={name}
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
                            disabled={isUpdating}
                        >
                            {isUpdating && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Update</span>
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </main>
    )

}
