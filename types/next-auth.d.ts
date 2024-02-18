import NextAuth from "next-auth/next";

declare module 'next-auth' {

    interface User {
        id?: string
        accessToken?: string
        username?: string
        exp?: number
    }

    interface Session extends NextAuth.Session {
        user: {
            accessToken: string
            id: string
            username: string
        },
    }

}