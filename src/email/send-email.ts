import { ReactElement } from "react";
import { render } from '@react-email/render';

export default async function sendReactEmail(jsx: ReactElement, subject: string, recipient: { email: string, name: string }, thread = true) {
    const html = render(jsx);
    const text = render(jsx, { plainText: true }); 

    if (!process.env.EMAIL_API_URL) {
        throw new Error("EMAIL_API_URL is not defined");
    }

    if (!process.env.EMAIL_SENDER) {
        throw new Error("EMAIL_SENDER is not defined");
    }
    

    await fetch(process.env.EMAIL_API_URL, {
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
                email: process.env.EMAIL_SENDER,
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
