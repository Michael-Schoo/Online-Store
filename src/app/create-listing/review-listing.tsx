'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dispatch, FormEvent, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Data } from "./create-listing"
import { validateDescription, validateName, validatePrice } from "./validators"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"


// Requirements
// - name
// - description
// - price (with currency selector)
// - tags (autocomplete)
// - images (urls) TODO: allow upload



export default function ListingReview({ data: dataState, setTab }: { data: [Data, Dispatch<SetStateAction<Data>>], setTab: Dispatch<SetStateAction<string>> }) {
    const [data, setData] = dataState
    // console.log(data)


    const nameError = validateName(data.name, true)
    const descriptionError = validateDescription(data.description, true)
    const priceError = validatePrice(data.price || 0, data.currency, true)

    const hasErrors = nameError || descriptionError || priceError


    const submit = (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        alert("YAY")

    }



    return (
        <form className="grid place-items-center" onSubmit={submit}>
            <Card className="w-full">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Review the listing</CardTitle>
                    <CardDescription>
                        Review the information below to create the listing
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    {/* show the data in a read-only basic info like could show up in normal page  (with a red ! if error) */}
                    <Card className="w-full">

                        <CardContent className="grid gap-4 pt-3">
                            <div>
                                <b className="font-bold pr-1">Name:</b>
                                <span className={nameError ? "text-destructive" : ''}>
                                    {data.name}
                                </span>
                                {nameError && <Error error={nameError} />}
                            </div>
                            <div>
                                <b className="font-bold pr-1">Price:</b>
                                <span className={priceError ? "text-destructive" : ''}>
                                    {data.price} <span className="text-muted-foreground">({data.currency})</span>
                                </span>
                                {priceError && <Error error={priceError} />}
                            </div>
                            <div>
                                <b className="font-bold">Description:</b>
                                {descriptionError && <Error error={descriptionError} />}
                                <ScrollArea className={cn("max-h-[200px] min-h-[50px] break-all rounded-md border p-2 pt-1", priceError && "text-destructive")}>
                                    {data.description || <i className="italic text-muted-foreground select-none">None provided...</i>}
                                </ScrollArea>
                            </div>

                        </CardContent>

                    </Card>


                </CardContent>

                <CardFooter className="flex sm:flex-row sm:justify-end sm:space-x-2 md:w-full whitespace-nowrap">
                    <Button className="" variant="secondary" onClick={() => setTab("images")}>
                        {"<"} Images
                    </Button>
                    <div className="sm:w-full m-2" />
                    {/* <div className="w-full"> */}
                    <Button className="w-full sm:w-auto min-w-[100px]" role="submit" disabled={!!hasErrors}>
                        Submit
                    </Button>
                    {/* </div> */}
                </CardFooter>
            </Card>


        </form>

    )
}


function Error({ error }: { error: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild className="cursor-default"><span>❗</span></TooltipTrigger>
                <TooltipContent>
                    <p>{error}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}