'use client'
import Image from 'next/image'
import daisyImg from "@/public/daisy-flowers-blue-3840x2160-12883.jpeg"
import TypingEffect from '@/components/TypingEffect'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import userServices from '@/services/user.services'
import { useSession } from 'next-auth/react'

const VerifyEmail = ({ params }: { params: { token: string } }) => {
    const { data: session, update } = useSession()
    const [userSession, setUser] = useState(session?.user || null);
    const router = useRouter()
    useEffect(() => {
        if (session?.error) {
            router.push('/login')
            return
        }
        if (session?.user) {
            setUser(session?.user)
        }
        try {
            if (userSession) {
                verify().then((res) => {
                    if (res && res?.result) {
                        const { accessToken, refreshToken } = res.result
                        updateSession(accessToken, refreshToken)
                        router.push('/')
                        return
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }, [params.token, userSession, session])

    const verify = useCallback(async () => {
        try {
            const res = await userServices.verifyEmail(params.token, userSession?.accessToken)
            return res
        } catch (error) {
            console.log(error)
        }
    }, [params.token, session, userSession])

    const updateSession = useCallback(async (accessToken: string, refreshToken: string) => {
        await update({
            ...session,
            user: {
                ...userSession,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })
    }, [session])
    return (
        <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://i.pinimg.com/originals/d2/e4/ed/d2e4ed3306b60642a22aceb4f49c6e9d.jpg)' }}>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left static">
                    <div className="card bg-base-content shadow-xl image-full">
                        <figure><Image src={daisyImg} alt='Daisy flower' ></Image></figure>
                        <div className="card-body">
                            <TypingEffect text=' VERIFY SUCCESS' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail