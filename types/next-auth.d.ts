import NextAuth from "next-auth/next";

declare module 'next-auth' {

    interface User {
        id?: string
        accessToken?: string
        exp?: number
    }

    interface Session {
        user: {
            accessToken: string
            id: string
        }
    }

}