//@ts-nocheck
'use client'
import Image from 'next/image'
import daisyImg from "@/public/daisy-flowers-blue-3840x2160-12883.jpeg"
import TypingEffect from '@/Components/TypingEffect'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import userServices from '@/services/user.services'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

const VerifyEmail = ({ params }: { params: { token: string } }) => {
    const { data: session, update } = useSession()
    const [accessToken, setAccessToken] = useState<string>(session?.user?.accessToken || '')
    const router = useRouter()
    useEffect(() => {
        setAccessToken(session?.user?.accessToken)
        if (session?.error) {
            router.push('/login')
            return
        }
        try {
            const verify = async () => {
                return await userServices.verifyEmail(params.token, accessToken)
            }
            if (accessToken) {
                console.log(accessToken)
                verify().then((res) => {
                    console.log(123)
                    if (res && res?.result) {
                        toast.success(res?.message)
                        const { accessToken, refreshToken } = res.result
                        updateSession(accessToken, refreshToken)
                        router.push('/')
                    } else {
                        router.push('/login')
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }, [params.token, session, accessToken])

    const updateSession = useCallback(async (accessToken: string, refreshToken: string) => {
        await update({
            ...session,
            user: {
                ...session?.user,
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