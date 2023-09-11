import { Tailwind } from '@react-email/tailwind';
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";

const magicLoginStyles = `:root{color-scheme: light dark !important;supported-color-schemes: light dark !important;font-family: 'Inter', Helvetica, Arial, sans-serif}`

export const MagicLogin = (magicLink: string, username: string, intention: "register" | "login") => {
    return (
        <Tailwind
            config={{
                theme: {
                    extend: {
                        breakpoints: {
                            md: '600px',
                        },
                        colors: {
                            dark: "#333333",
                            light: "#FFFFFF",
                            "dark-grey": "#51545E",
                            "light-grey": "#F4F4F4",
                            "just-black": "#111111"
                        },
                        fontSize: {
                            base: '1rem',
                            lg: '1.375rem'
                        },
                        lineHeight: {
                            text: '1.625'
                        },
                        margin: {
                            body: '0.4em 0 1.1875em'
                        }
                    },
                },
                darkMode: "media"
            }}
        >
            <Head>
                <meta name="color-scheme" content="light dark" />
                <meta name="supported-color-schemes" content="light dark" />
                <style type="text/css" rel="stylesheet" media="all">{magicLoginStyles}</style>
                {/* <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" /> */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="x-apple-disable-message-reformatting" />

            </Head>
            <Html lang='en'>
                <div className='bg-light-grey p-[40px] md:p-[80px] dark:bg-dark rounded-lg text-base font-text text-dark-grey dark:text-white'>
                    {/* centering... */}
                    <div>
                        <h1 className='mt-0 font-lg font-bold text-dark dark:text-white'>
                            {
                                intention === "register" ? "Welcome to Online Store,"
                                    : intention === "login" ? `Hey @${username} 👋,`
                                        : "???"
                            }
                        </h1>

                        <p className='m-body'>
                            Click the link below to {intention === "register" ? 'activate' : intention === "login" ? 'sign in' : '???'} your account.
                        </p>

                        <a
                            href={magicLink}
                            className="w-full md:w-auto text-center m-body text-white bg-just-black border-just-black border-x-[18px] border-y-[10px] border-solid inline-block no-underline rounded-[3px] box-border"
                        >
                            {
                                intention === "register" ? "Activate Account"
                                    : intention === "login" ? "Login"
                                        : "???"
                            }
                        </a>

                        <p className='m-body'>
                            This link expires in 24 hours and can only be used once.
                        </p>

                        {intention === "login" && (
                            <p className='m-body'>
                                If you did not try to log into your account, you can safely ignore it.
                            </p>
                        )}
                    </div>
                </div>

            </Html>

        </Tailwind>
    );
};
