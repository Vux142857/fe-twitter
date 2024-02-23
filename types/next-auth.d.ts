import NextAuth from "next-auth/next";

declare module 'next-auth' {

    interface User {
        id?: string
        accessToken?: string
        refreshToken?: string
        username?: string
        exp?: number // Numberic time stamp seconds - experation time of user
        expAT?: number // Numberic time stamp seconds - experation time of access token
    }

    interface Session extends NextAuth.Session {
        user: {
            accessToken: string
            id: string
            username: string
        },
        error?: string
    }

}