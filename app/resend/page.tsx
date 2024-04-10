'use client'
import Image from 'next/image'
import daisyImg from "@/public/daisy-flowers-blue-3840x2160-12883.jpeg"
import TypingEffect from '@/Components/TypingEffect'
import { useCallback, useEffect, useState } from 'react'
import userServices from '@/services/user.services'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/Components/Button'

const ForgotPassword = () => {
    const { data: session } = useSession();
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
    }, [session])
    const handleSubmit = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const res = await userServices.resendVerifyEmail(userSession.email, userSession.accessToken)
            if (res && res?.message) {
                toast.success(res.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.message)
        }
    }, [userSession])

    return (
        <>
            <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://i.pinimg.com/originals/d2/e4/ed/d2e4ed3306b60642a22aceb4f49c6e9d.jpg)' }}>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className="card-body">
                            <div className="form-control mt-6">
                                <Button onClick={handleSubmit} label='Resend email' />
                            </div>
                        </div>
                    </div>
                    <div className="text-center lg:text-left static">
                        <div className="card bg-base-content shadow-xl image-full">
                            <figure><Image src={daisyImg} alt='Daisy flower' ></Image></figure>
                            <div className="card-body">
                                <TypingEffect text=' CHECK YOUR EMAIL <3, ( may be in spam email :(( )' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword;