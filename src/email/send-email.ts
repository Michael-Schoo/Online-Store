import { ReactElement } from "react";
import { render } from '@react-email/render';
import { env } from "@/env";

export default async function sendReactEmail(jsx: ReactElement, subject: string, recipient: { email: string, name: string }, thread = true) {
    const html = render(jsx);
    const text = render(jsx, { plainText: true }); 

    

    await fetch(env.EMAIL_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            headers: {
                "X-Entity-Ref-ID": !thread ? new Date().getTime() + "" : undefined,
            },
            personalizations: [
                { to: [recipient] }
            ],
            from: {
                email: env.SMTP_FROM,
                name: "Store App"
            },
            subject,
            content: [
                {
                    type: "text/plain",
                    value: text
                },
                {
                    type: "text/html",
                    value: html
                }
            ]
        })
    });
}
