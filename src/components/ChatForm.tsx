'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { Button, buttonVariants } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent, TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/components/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import {CornerDownLeftIcon, PlusIcon} from "lucide-react";
import * as z from "zod";
import {createMessageSchema, listingCreateSchema} from "@/lib/validations/listing";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {ChatMessageType} from "@prisma/client";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {CounterOfferModal} from "@/components/ChatModal";
import {currencies} from "@/lib/tools";

export interface PromptProps {
    id: {
        userId: string,
        listingId: string
    },
    currentPrice: number
}

type FormData = z.infer<typeof createMessageSchema>


export function ChatForm({id, currentPrice}: PromptProps) {
    const { formRef, onKeyDown } = useEnterSubmit()
    const inputRef = React.useRef<HTMLTextAreaElement>(null)
    const router = useRouter()

    const {
        handleSubmit,
        register,
        formState: { errors },
        getValues,
        setValue
    } = useForm<FormData>({
        resolver: zodResolver(createMessageSchema),
    })

    const [isCreating, setIsCreating] = useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsCreating(true)

        const response = await fetch(`/api/listing/${id.listingId}/chat/${id.userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: data.message,
                type: ChatMessageType.MESSAGE
            }),
        })

        if (!response.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your sign in request failed. Please try again.",
                variant: "destructive",
            })
        }

        setIsCreating(false)
        setValue('message', '')

        // toast({
        //     title: "Created Listing!",
        //     description: "Please fill out the rest of the information.",
        // })

        // const listing = await response.json()
        router.refresh()
    }


    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    return (
        <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
            <div className="mx-auto sm:max-w-2xl sm:px-4">
                <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">

                    <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
                    <TooltipProvider>
                    <Tooltip>
                        {/*todo options button*/}
                        <TooltipTrigger asChild>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                            <button
                                className={cn(
                                    buttonVariants({ size: 'sm', variant: 'outline' }),
                                    'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
                                )}
                            >
                                <PlusIcon />
                                <span className="sr-only">More Options</span>
                            </button>
                                </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-12">
                                        <DropdownMenuItem>
                                            <CounterOfferModal id={id} currentPrice={currentPrice}>
                                                <span>Counter Offer</span>
                                            </CounterOfferModal>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent>More Options</TooltipContent>
                    </Tooltip>
                    <Textarea
                        tabIndex={0}
                        onKeyDown={onKeyDown}
                        rows={1}
                        placeholder="Send a message."
                        spellCheck={false}
                        className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                        {...register("message")}
                    />
                    <div className="absolute right-0 top-3 sm:right-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isCreating}
                                >
                                    <CornerDownLeftIcon />
                                    <span className="sr-only">Send message</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send message</TooltipContent>
                        </Tooltip>
                    </div>
                    </TooltipProvider>
                </div>
            </form>
            </div>
        </div>
    </div>
    )
}