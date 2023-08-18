import { useLayoutEffect } from "react"

// @see https://usehooks.com/useLockBodyScroll.
export function useLockBody() {
    useLayoutEffect((): (() => void) => {
        const originalStyle: string = window.getComputedStyle(
            document.body,
        ).overflow
        document.body.style.overflow = "hidden"

        // blurring the background
        const main = document.querySelector("body main") as HTMLElement
        main.style.filter = "blur(1px)"

        return () => {
            document.body.style.overflow = originalStyle
            main.style.filter = "blur(0px)"
        }
    }, [])
}
