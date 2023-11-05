'use client'

import { Button } from '@/components/ui/button'
import {ArrowRightIcon} from "lucide-react";

const exampleMessages = [
    {
        heading: 'Offer to buy it',
        message: `Hello, is this still available, if so can I purchase it?: \n`
    },
]

// TODO actually use the input
export function EmptyScreen({ setInput = (_: string) => {} }) {
    return (
        <div className="mx-auto max-w-2xl px-4">
            <div className="rounded-lg border bg-background p-8">
                <h1 className="mb-2 text-lg font-semibold">
                    Welcome to your listing chat!
                </h1>
                <p className="mb-2 leading-normal text-muted-foreground">
                    This is an way for you to communicate with the listing creator and discuss things...
                </p>
                <p className="leading-normal text-muted-foreground">
                    You can start a conversation here or try the following examples:
                </p>
                <div className="mt-4 flex flex-col items-start space-y-2">
                    {exampleMessages.map((message, index) => (
                        <Button
                            key={index}
                            variant="link"
                            className="h-auto p-0 text-base"
                            onClick={() => setInput(message.message)}
                        >
                            <ArrowRightIcon className="mr-2 text-muted-foreground" />
                            {message.heading}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}