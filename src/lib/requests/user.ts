'use client'
import useSWR from "swr";


interface User {
    id: number
    username: string
    admin: boolean
}

interface LoggedInUser extends User {
    email: string
}

async function getUser(userId: string) {
    const res = await fetch(`/api/user/${userId}`)
    const data = await res.json()
    return data
}


export function useUser(userId: string) {
    const { data, error, mutate, isValidating } = useSWR<User>(`/user/${userId}`, () => getUser(userId), {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
    })

    return {
        user: data || null,
        isLoading: isValidating,
        isError: error,
        mutate,
    }

}

export function useLoggedInUser() {
    const { data, error, mutate, isValidating } = useSWR<LoggedInUser>(`/user/@me`, () => getUser("@me"), {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
    })

    return {
        user: data || null,
        isLoading: isValidating,
        isError: error,
        isLoggedOut: error?.status === 401,
        mutate,
    }
}
