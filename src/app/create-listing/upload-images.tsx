'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dispatch, FormEvent, SetStateAction } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Data } from "./create-listing"
import { UploadDropzone } from "@/components/uploadthing"

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";
import { validateImages } from "./validators"


// upload images button
// show images (with delete button)
// max 10 images
// store list of ids in listing data

export default function UploadImages({ data: dataState, setTab }: { data: [Data, Dispatch<SetStateAction<Data>>], setTab: Dispatch<SetStateAction<string>> }) {
    const [data, setData] = dataState

    const addImages = (images: string[]) => {
        setData(d => ({
            ...d,
            images: [...d.images, ...images]
        }))
    }

    const removeImage = (id: string) => {
        // TODO: delete from server
        setData(d => ({
            ...d,
            images: d.images.filter(i => i !== id)
        }))
    }

    const imagesError = validateImages(data.images)


    const submit = (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        setTab("images")
    }


    return (
        <form className="grid place-items-center" onSubmit={submit}>
            <Card className="w-full">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Add Images</CardTitle>
                    <CardDescription>
                        Add or remove images for your listing
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="border-dashed border-4 rounded-xl">
                            <UploadDropzone
                                endpoint="listingImages"
                                onClientUploadComplete={(res) => {
                                    // Do something with the response
                                    console.log("Files: ", res);
                                    addImages(res?.map(f => f.key) || [])
                                }}
                                onUploadError={(error) => {
                                    // Do something with the error.
                                    alert(`ERROR! ${error.message}`);
                                    console.log(error)
                                }}
                            />
                        </div>


                        {imagesError && (
                            <div className="text-red-500">
                                {imagesError}
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* show images */}
                {/* https://utfs.io/f/{ID} */}
                <CardContent className="grid gap-4">
                    {data.images.map((image, i) => (
                        <div key={i} className="">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`https://utfs.io/f/${image}`} alt="Uploaded Image" className="w-full object-cover" />
                            <Button variant="destructive" size='sm' className="mt-1 mr-1" onClick={() => removeImage(image)}>
                                Remove
                            </Button>
                            <Button variant="outline" size='sm' className="mt-1 mr-1 border-2">Add Description</Button>

                        </div>
                    ))}
                </CardContent>

                <CardFooter className="flex sm:flex-row sm:justify-end sm:space-x-2 md:w-full whitespace-nowrap">
                    <Button variant="secondary" onClick={() => setTab("basic")}>
                        {"<"} Information
                    </Button>
                    <div className="sm:w-full m-2" />
                    <Button className="w-full sm:w-auto min-w-[100px]" onClick={() => setTab("review")} disabled={!!imagesError}>
                        {">"} Review
                    </Button>
                </CardFooter>
            </Card>


        </form>

    )
}
