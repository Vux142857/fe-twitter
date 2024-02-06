'use client'
import { SessionProvider } from "next-auth/react"

interface ProviderProps {
    children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children, session }: any) => {
    return (
        <>
            <SessionProvider session={session} refetchInterval={60 * 15}>
                {children}
            </SessionProvider>
        </>
    )
}

export default Provider