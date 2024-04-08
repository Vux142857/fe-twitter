import NextAuth from "next-auth/next";

declare module 'next-auth' {

    interface User {
        id: string
        accessToken: string
        refreshToken: string
        username: string
        avatar: string
        email: string
        verify: number
        expRT: number // Numberic time stamp seconds - experation time of user
        expAT: number // Numberic time stamp seconds - experation time of access token
    }

    interface Session extends NextAuth.Session {
        user: {
            accessToken: string
            refreshToken: string
            id: string
            email: string
            username: string
            avatar: string
            verify: number
        },
        error?: string
    }

}