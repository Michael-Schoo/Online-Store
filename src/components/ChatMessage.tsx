// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { cn } from '@/lib/utils'
import { ChatMessageActions } from '@/components/ChatMessageOptions'
import { UserIcon } from "lucide-react";
import { ChatList } from "@/components/ChatList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessageType } from "@prisma/client";

export interface ChatMessageProps {
    message: ChatList['messages'][0],
    currentPrice?: number
}

export function ChatMessage({ message, currentPrice, ...props }: ChatMessageProps) {
    return (
        <div
            className={cn('group relative mb-4 flex items-start md:-ml-12')}
            {...props}
        >
            <Avatar className="h-8 w-8">
                <AvatarImage
                    src={message.user.avatar!}
                    alt={`${message.user.name}`}
                />
                <AvatarFallback>
                    <div
                        className={cn(
                            'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow',
                            message.user.isYou
                                ? 'bg-background'
                                : 'bg-primary text-primary-foreground'
                        )}
                    >
                        <UserIcon />
                    </div>
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
                <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                    {
                        message.type === ChatMessageType.MESSAGE ? (
                            <p className="mb-2 last:mb-0">{message.message}</p>
                        ) : (
                            <div className="flex flex-col items-start space-y-2">
                                <div className="flex flex-col items-start space-y-2">
                                    <p className="mb-2 last:mb-0">Current Price: ${currentPrice}</p>
                                    <p className="mb-2 last:mb-0">Counter Offer: ${message.message}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}