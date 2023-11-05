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
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

export function PublishModal({ listing, name, disabled }: { listing: string, name: string, disabled: boolean }) {
    const [isPublishing, setPublishing] = useState<boolean>(false)
    const router = useRouter()

    async function onSubmit(form: FormEvent<HTMLFormElement>) {
        form.preventDefault()
        setPublishing(true)

        const res = await fetch(`/api/listing/${listing}/publish`, {
            method: "POST",
        })

        if (!res.ok) {
            setPublishing(false)
            return toast({
                title: "Something went wrong.",
                description: "Your listing could not be published.",
                variant: "destructive",
            })
        }

        router.push(`/listing/${listing}`, {})

        toast({
            title: "Published listing.",
            description: "Your listing has now been published.",
        })

        dialogClose()

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" disabled={disabled}>
                    Publish
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="py-4">
                        <DialogTitle>Are you sure that you want to publish now?</DialogTitle>
                        <DialogDescription>
                            Once it is published, this is publicly shown and you will have restrictions. This will publish you listing <b className="font-bold">{name}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-y-2">
                        <Button type="button" variant="secondary" disabled={isPublishing} onClick={dialogClose}>
                            Not yet
                        </Button>
                        <Button type="submit" variant='default' disabled={isPublishing}>
                            {isPublishing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Publish!</span>
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}