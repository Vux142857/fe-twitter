'use client'
import { SessionProvider } from "next-auth/react"

interface ProviderProps {
    children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children, session }: any) => {
    return (
        <>
            <SessionProvider session={session}>{children}</SessionProvider>
        </>
    )
}

export default Provider