"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Dispatch, FormEvent, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Data } from "./create-listing"
import {
    validateDescription,
    validateImages,
    validateName,
    validatePrice,
} from "./validators"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

// Requirements
// - name
// - description
// - price (with currency selector)
// - tags (autocomplete)
// - images (urls) TODO: allow upload

export default function ListingReview({
    data: dataState,
    setTab,
}: {
    data: [Data, Dispatch<SetStateAction<Data>>]
    setTab: Dispatch<SetStateAction<string>>
}) {
    const [data, setData] = dataState

    const nameError = validateName(data.name, true)
    const descriptionError = validateDescription(data.description, true)
    const priceError = validatePrice(data.price || 0, data.currency, true)
    const imagesError = validateImages(data.images)

    const hasErrors = nameError || descriptionError || priceError || imagesError

    const router = useRouter()

    const submit = async (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        setTab("review")

        const res = await fetch("/api/listing", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })

        const json = await res.json()
        if (res.ok && json.id) {
            setTab("success")
            router.push(`/listing/${json.id}`)
        } else {
            alert("Something went wrong")
            console.log(json)
        }
    }

    return (
        <form className="grid place-items-center" onSubmit={submit}>
            <Card className="w-full">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">
                        Review the listing
                    </CardTitle>
                    <CardDescription>
                        Review the information below to create the listing
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    {/* show the data in a read-only basic info like could show up in normal page  (with a red ! if error) */}
                    <Card className="w-full">
                        <CardContent className="grid gap-4 pt-3">
                            <div>
                                <b className="pr-1 font-bold">Name:</b>
                                <span
                                    className={nameError ? "text-red-500" : ""}
                                >
                                    {data.name}
                                </span>
                                {nameError && <Error error={nameError} />}
                            </div>
                            <div>
                                <b className="pr-1 font-bold">Price:</b>
                                <span
                                    className={priceError ? "text-red-500" : ""}
                                >
                                    {data.price}{" "}
                                    <span className="text-muted-foreground">
                                        ({data.currency})
                                    </span>
                                </span>
                                {priceError && <Error error={priceError} />}
                            </div>
                            <div>
                                <b className="font-bold">Description:</b>
                                {descriptionError && (
                                    <Error error={descriptionError} />
                                )}
                                <ScrollArea
                                    className={cn(
                                        "max-h-[200px] min-h-[50px] break-all rounded-md border p-2 pt-1",
                                        descriptionError && "text-red-500",
                                    )}
                                >
                                    {data.description || (
                                        <i className="select-none italic text-muted-foreground">
                                            None provided...
                                        </i>
                                    )}
                                </ScrollArea>
                            </div>
                            <div>
                                {/* grid of images */}
                                <b className="font-bold">Images:</b>
                                {imagesError && <Error error={imagesError} />}
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {data.images.map((img, i) => (
                                        <Card key={i} className="w-full">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://utfs.io/f/${img}`}
                                                alt="listing image"
                                                className="h-full w-full rounded-md object-cover"
                                            />
                                        </Card>
                                    ))}
                                </div>
                                {data.images.length === 0 && (
                                    <i className="select-none italic text-muted-foreground">
                                        None provided...
                                    </i>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>

                <CardFooter className="flex whitespace-nowrap sm:flex-row sm:justify-end sm:space-x-2 md:w-full">
                    <Button
                        variant="secondary"
                        onClick={() => setTab("images")}
                    >
                        {"<"} Images
                    </Button>
                    <div className="m-2 sm:w-full" />
                    <Button
                        className="w-full min-w-[100px] sm:w-auto"
                        role="submit"
                        disabled={!!hasErrors}
                    >
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}

function Error({ error }: { error: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild className="cursor-default">
                    <span>❗</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{error}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
