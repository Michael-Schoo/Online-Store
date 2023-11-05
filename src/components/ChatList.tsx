import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/ChatMessage'
import {ChatMessageType} from "@prisma/client";

export interface ChatList {
    messages: {
        message: string,
        type: ChatMessageType,
        user: {
            id: string,
            name: string,
            avatar: string | null,
            isYou: boolean
        },
        createdAt: Date
    }[],
    currentPrice?: number
}

export function ChatList({ messages, currentPrice }: ChatList) {
    if (!messages.length) {
        return null
    }

    return (
        <div className="relative mx-auto max-w-2xl px-4">
            {messages.map((message, index) => (
                <div key={index}>
                    <ChatMessage message={message} currentPrice={currentPrice}/>
                    {index < messages.length - 1 && (
                        <Separator className="my-4 md:my-8" />
                    )}
                </div>
            ))}
        </div>
    )
}