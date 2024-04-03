//@ts-nocheck
'use client'
import Image from 'next/image'
import daisyImg from "@/public/daisy-flowers-blue-3840x2160-12883.jpeg"
import TypingEffect from '@/Components/TypingEffect'
import { useState } from 'react'
import userServices from '@/services/user.services'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const res = await userServices.createForgotPassword(email)
            if (res && res?.message) {
                toast.success(res.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.message)
        }
    }

    return (
        <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://i.pinimg.com/originals/d2/e4/ed/d2e4ed3306b60642a22aceb4f49c6e9d.jpg)' }}>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input name='email' type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="email" className="input input-bordered" value={email} required />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type='submit'>Send email</button>
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

export default ForgotPassword