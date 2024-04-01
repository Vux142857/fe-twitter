import NextAuth from "next-auth/next";

declare module 'next-auth' {

    interface User {
        id?: string
        accessToken?: string
        refreshToken?: string
        username?: string
        avatar?: string
        exp?: number // Numberic time stamp seconds - experation time of user
        expAT?: number // Numberic time stamp seconds - experation time of access token
        profile?: any
    }

    interface Session extends NextAuth.Session {
        user: {
            accessToken: string
            refreshToken: string
            id: string
            username: string
            avatar: string
        },
        error?: string
    }

}