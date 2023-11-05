'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    dialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {createCounterOfferSchema, createMessageSchema, listingImageSchema} from "@/lib/validations/listing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Trash2Icon, PencilIcon } from "lucide-react"
import { FormEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"


type FormData = z.infer<typeof createCounterOfferSchema>


export function CounterOfferModal({ id, currentPrice, children }: { id: {userId: string, listingId: string}, currentPrice: number, children: React.ReactNode }) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(createCounterOfferSchema),
        defaultValues: {
            price: currentPrice,
        },
    })
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function onSubmit(data: FormData) {

        setIsSaving(true)

        const response = await fetch(`/api/listing/${id.listingId}/chat/${id.userId}/offer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response?.ok) {
            setIsSaving(false)
            return toast({
                title: "Something went wrong.",
                description: "Your counter offer didn't work. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your price as been suggested.",
        })

        router.refresh()
        dialogClose()
        setTimeout(() => setIsSaving(false), 50)
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Counter Offer</DialogTitle>
                        <DialogDescription>
                            Set a price you are willing to pay and see if the listing creator is willing.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Price
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="name"
                                    defaultValue={currentPrice}
                                    {...register("price")}
                                />
                                {errors?.price && (
                                    <p className="py-1 text-xs text-red-600">{errors.price.message}</p>
                                )}
                            </div>

                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Propose</span>
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}

