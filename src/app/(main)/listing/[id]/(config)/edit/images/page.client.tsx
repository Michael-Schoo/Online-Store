"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { UploadDropzone } from "@/components/uploadthing"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { DeleteModal, EditInfoModal } from "./modal.client"

// upload images button
// show images (with delete button)
// max 10 images
// store list of ids in listing data

export default function UploadImages({ images, listingId }: { images: { alt: string | null, id: string, url: string }[], listingId: string }) {

    const router = useRouter()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Images ({images.length}/10)</CardTitle>
                <CardDescription>
                    Add or remove images for your listing
                </CardDescription>
            </CardHeader>

            {/* show images */}
            {/* https://utfs.io/f/{ID} */}

            <CardContent className="flex gap-4 flex-grow flex-wrap">

                {images.length < 10 && (

                    <div className="min-w-0 w-full">

                        <UploadDropzone
                            endpoint="listingImages"

                            onClientUploadComplete={(res) => {
                                // Do something with the response
                                console.log("Files: ", res)

                                toast({
                                    title: "Uploaded!",
                                    description: "Your images have been uploaded.",
                                })


                                // prefetch the images before the refresh
                                res?.forEach((image) => {
                                    const img = new Image()
                                    img.src = image.url
                                })

                                router.refresh()

                            }}


                            onUploadBegin={() => { }}

                            onUploadError={(error) => {
                                // Do something with the error.
                                console.log(error)

                                // todo: show better user error
                                // - most common is too many images uploaded

                                toast({
                                    title: "Something went wrong.",
                                    description: error.message,
                                    variant: "destructive",
                                })

                                // sometimes some of the images will upload
                                router.refresh()
                            }}

                            className="cursor-pointer"
                            appearance={{
                                container: "border-dashed border-4 rounded-xl border-border w-full mt-0 h-full",
                                label: "w-auto",
                            }}

                            config={{
                                mode: "auto"
                            }}
                        />
                    </div>
                )}

                {images.map((image, i) => (
                    <div key={image.id} className="space-y-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image.url}
                            alt={image.alt || "Uploaded Image"}
                            title={image.alt || "Uploaded Image"}
                            className="min-w-0 max-w-sm h-48 w-full object-contain"
                        />

                        <div className="space-x-2">
                            <DeleteModal image={image.id} listing={listingId} name={image.alt} />
                            <EditInfoModal image={image.id} listing={listingId} currentAlt={image.alt} />
                        </div>

                    </div>
                ))}

            </CardContent>
        </Card>
    )
}