//@ts-nocheck
'use client'
import Image from 'next/image'
import daisyImg from "@/public/daisy-flowers-blue-3840x2160-12883.jpeg"
import TypingEffect from '@/Components/TypingEffect'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import {  useState } from 'react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
    const router = useRouter()
    // const {data: session} = useSession()
    // if (session) {
    //     router.push('/')
    // }
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const res = await signIn('Sign In', {
                redirect: false,
                email,
                password,
            })
            if (res?.error) {
                setError(res.error)
            } else {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    // const loginWithGoogle = () => { signIn('google', { callbackUrl: '/' }) }
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
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input name='password' type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="password" className="input input-bordered" value={password} required />
                        </div>
                        {error && (<div role="alert" className="alert alert-error">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>)}
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type='submit'>Login</button>
                        </div>
                        {/* <div className="form-control mt-2">
                            <button className="btn" onClick={loginWithGoogle}>
                                Login with Google
                                <FcGoogle className='ml-2' />
                            </button>
                        </div> */}
                        <div className='form-control'>
                            <label className="label">
                                <span className="label-text">Do not have account?
                                    <Link href='/register' > Register here</Link>
                                </span>
                            </label>
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

export default Login