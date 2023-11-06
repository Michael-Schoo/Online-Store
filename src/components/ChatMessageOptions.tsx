'use client'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/components/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import { CheckIcon, CopyIcon } from "lucide-react";
import { ChatList } from "@/components/ChatList";

interface ChatMessageActionsProps {
    message: ChatList['messages'][0],
    className?: string
}

export function ChatMessageActions({
    message,
    className,
}: ChatMessageActionsProps) {
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

    const onCopy = () => {
        if (isCopied) return
        copyToClipboard(message.message)
    }

    return (
        <div
            className={cn(
                'flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0',
                className
            )}
        >
            <Button variant="ghost" size="icon" onClick={onCopy}>
                {isCopied ? <CheckIcon /> : <CopyIcon />}
                <span className="sr-only">Copy message</span>
            </Button>
        </div>
    )
}