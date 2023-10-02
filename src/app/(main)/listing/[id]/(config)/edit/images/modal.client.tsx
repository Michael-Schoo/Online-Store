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
import { listingImageSchema } from "@/lib/validations/listing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Trash2Icon, PencilIcon } from "lucide-react"
import { FormEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"


type FormData = z.infer<typeof listingImageSchema>


export function EditInfoModal({ image, listing, currentAlt }: { image: string, listing: string, currentAlt: string | null }) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(listingImageSchema),
        defaultValues: {
            alt: currentAlt || "",
        },
    })
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function onSubmit(data: FormData) {

        setIsSaving(true)

        const response = await fetch(`/api/listing/${listing}/image/${image}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response?.ok) {
            setIsSaving(false)
            return toast({
                title: "Something went wrong.",
                description: "Your information was not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your image has been updated.",
        })

        router.refresh()
        dialogClose()
        setTimeout(() => setIsSaving(false), 50)
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-2 gap-2" size="sm">
                    <PencilIcon/> Edit description
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit image</DialogTitle>
                        <DialogDescription>
                            Make changes to the image&apos;s name. This used for alt text and extra info for the viewer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="name"
                                    defaultValue="Pedro Duarte"
                                    {...register("alt")}
                                />
                                {errors?.alt && (
                                    <p className="py-1 text-xs text-red-600">{errors.alt.message}</p>
                                )}
                            </div>

                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Save changes</span>
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}


export function DeleteModal({ image, listing, name }: { image: string, listing: string, name: string | null }) {
    const [isDeleting, setDeleting] = useState<boolean>(false)
    const router = useRouter()

    async function onSubmit(form: FormEvent<HTMLFormElement>) {
        form.preventDefault()
        setDeleting(true)

        const res = await fetch(`/api/listing/${listing}/image/${image}`, {
            method: "DELETE",
        })

        if (!res.ok) {
            setDeleting(false)
            return toast({
                title: "Something went wrong.",
                description: "Your image could not be removed.",
                variant: "destructive",
            })
        }

        router.refresh()

        toast({
            title: "Removed image.",
            description: "Your image has been removed.",
        })

        dialogClose()

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2Icon />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="py-4">
                        <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your image: <b className="font-bold">{name}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-y-2">
                        <Button type="button" variant="secondary" disabled={isDeleting} onClick={dialogClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant='destructive' disabled={isDeleting}>
                            {isDeleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Delete</span>
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}