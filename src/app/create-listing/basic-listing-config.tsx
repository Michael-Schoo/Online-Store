'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { wait } from "@/lib/tools"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Data } from "./create-listing"
import { validateDescription, validateName, validatePrice } from "./validators"


// Requirements
// - name
// - description
// - price (with currency selector)
// - tags (autocomplete)
// - images (urls) TODO: allow upload


const currencies = [
    { name: "USD", symbol: "$" },
    { name: "AUD", symbol: "A$" },
]


export default function ListingInfoBasic({ data: dataState, setTab }: { data: [Data, Dispatch<SetStateAction<Data>>], setTab: Dispatch<SetStateAction<string>>}) {
    const [data, setData] = dataState

    const setName = (name: string) => setData({ ...data, name })
    const setDescription = (description: string) => setData({ ...data, description })
    const setPrice = (price: number) => setData({ ...data, price })
    const setCurrency = (currency: string) => setData({ ...data, currency })


    const nameError = validateName(data.name)
    const descriptionError = validateDescription(data.description)
    const priceError = validatePrice(data.price || 0, data.currency)


    const submit = (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        setTab("images")
    } 


    return (
        <form className="grid place-items-center" onSubmit={submit}>
            <Card className="w-full">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Create a Listing</CardTitle>
                    <CardDescription>
                        Enter the information below to create a listing
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="name" placeholder=""
                            className={nameError ? "invalid-input" : ""}
                            onChange={e => setName(e.target.value)}
                            maxLength={50} minLength={3}
                            required
                            value={data.name}
                        />

                        {nameError && (
                            <div className="text-destructive">
                                {nameError}
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" itemType="description" placeholder=""
                            className={descriptionError ? "invalid-input" : ""}
                            onChange={e => setDescription(e.target.value)}
                            maxLength={3_500}
                            value={data.description}
                        />

                        {descriptionError && (
                            <div className="text-destructive">
                                {descriptionError}
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* price (with currency dropdown) */}
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <div className="flex w-full max-w-sm items-center space-x-2">

                            <Select defaultValue={data.currency} onValueChange={(v) => setCurrency(v || "USD")}>

                                <SelectTrigger className="w-[175px]" id="price">
                                    <SelectValue placeholder="USD"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Currency</SelectLabel>
                                        {currencies.map((c, i) => (
                                            <SelectItem
                                                key={c.name}
                                                value={c.name}
                                                defaultChecked={i === 0}
                                                textValue={c.symbol}
                                            >
                                                {c.name} ({c.symbol})
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>


                            <Input id="price" type="number" placeholder="30.25"
                                className={priceError ? "invalid-input w-full" : "w-full"}
                                onChange={e => setPrice(Number(e.target.value))}
                                min={0}
                                step={0.25}
                                max={10_000}
                                required
                                value={data.price || undefined}
                            />
                        </div>


                        {priceError && (
                            <div className="text-destructive">
                                {priceError}
                            </div>
                        )}
                    </div>
                </CardContent>

                            

                <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 md:w-full">
                    <Button className="w-full sm:w-auto" role="submit">
                         {">"} Upload images
                    </Button>
                </CardFooter>
            </Card>


        </form>

    )
}
