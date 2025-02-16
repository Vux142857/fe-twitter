//@ts-nocheck
'use client'
import Image from 'next/image'
import daisyImg from "@/public/daisy-flowers-blue-3840x2160-12883.jpeg"
import TypingEffect from '@/components/TypingEffect'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bounce, toast } from 'react-toastify'
// import { FcGoogle } from 'react-icons/fc'

const Login = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            toast.info('🦄 W8 pls <3', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            const res = await signIn('Sign In', {
                redirect: false,
                email,
                password,
            })
            if (res?.error) {
                toast.warning('Login failure !', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            } else {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit(event);
        }
    };

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
                            <input name='password' type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="password" className="input input-bordered" value={password} onKeyDown={handleKeyDown} required />
                        </div>
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
                                <span className="label-text">Forgot password ?
                                    <Link href='/forgot-password' > Change password </Link>
                                </span>
                            </label>
                        </div>
                        <div className='form-control'>
                            <label className="label">
                                <span className="label-text">Do not have account?
                                    <Link href='/register' > Register here</Link>
                                </span>
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login