//@ts-nocheck
'use client'
import Image from 'next/image'
import daisyImg from "@/public/daisy-flowers-blue-3840x2160-12883.jpeg"
import TypingEffect from '@/components/TypingEffect'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import userServices from '@/services/user.services'
import { toast } from 'react-toastify'

const ResetPassword = ({ params }: { params: { token: string } }) => {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    useEffect(() => {
        try {
            const verify = async () => {
                return await userServices.verifyForgotPassword(params.token)
            }
            verify().then((res) => {
                if (res && res?.message) {
                    toast.success(res.message)
                } else {
                    router.push('/login')
                }
            })
        } catch (error) {
            console.log(error)
            toast.error(error?.message)
        }
    }, [params.token])
    const handleSubmit = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Password does not match')
            return
        }
        try {
            const res = async () => {
                return await userServices.changePassword(password, params.token, confirmPassword)
            }
            res().then(() => {
                router.push('/login')
            })
        } catch (error) {
            console.log(error)
            setError(error?.message)
        }
    }, [params.token, password, confirmPassword])

    return (
        <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://i.pinimg.com/originals/d2/e4/ed/d2e4ed3306b60642a22aceb4f49c6e9d.jpg)' }}>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input name='password' type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="password" className="input input-bordered" value={password} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm password</span>
                            </label>
                            <input name='confirm-password' type="password" onChange={(e) => { setConfirmPassword(e.target.value) }} placeholder="confirm password" className="input input-bordered" value={confirmPassword} required />
                        </div>
                        {error && <div className="form-control mt-6">
                            <p className="text-red-500">{error}</p></div>}
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type='submit'>Change password</button>
                        </div>
                    </form>
                </div>
                <div className="text-center lg:text-left static">
                    <div className="card bg-base-content shadow-xl image-full">
                        <figure><Image src={daisyImg} alt='Daisy flower' ></Image></figure>
                        <div className="card-body">
                            <TypingEffect text='WELCOME BACK HAVE A GOOD DAY <3' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword