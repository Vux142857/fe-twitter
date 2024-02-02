/* eslint-disable react/no-unescaped-entities */
// @ts-nocheck
'use client'
import Image from 'next/image'
import daisyImg from "@/public/daisy-flowers-blue-3840x2160-12883.jpeg"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { RegisterReqBody } from '@/services/auth.service'
const Register = () => {
    const router = useRouter()
    const [dob, setDob] = useState(new Date())
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        date_of_birth: dob
    })
    const [matchPassword, setMatchPassword] = useState(true)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    useEffect(() => {
        setMatchPassword(formData.password === formData.confirmPassword)
    }, [formData.password, formData.confirmPassword])

    const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const res = await signIn('Sign Up', {
                name: formData,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                confirm_password: formData.confirmPassword,
                date_of_birth: dob.toISOString(),
                redirect: false,
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

    const loginWithGoogle = () => { signIn('google', { callbackUrl: '/' }) }

    return (
        <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://i.pinimg.com/originals/d2/e4/ed/d2e4ed3306b60642a22aceb4f49c6e9d.jpg)' }}>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <Image src={daisyImg} alt='Daisy flower' />
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">What is your name ?</span>
                            </label>
                            <input name='name' value={formData.name} type="text" placeholder="Type here" className="input input-bordered" onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input name='email' value={formData.email} type="email" placeholder="Type here" className="input input-bordered" onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input name='username' value={formData.username} type="text" placeholder="Type here" className="input input-bordered" onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input name='password' value={formData.password} type="password" placeholder="Type here" className="input input-bordered" onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm password</span>
                            </label>
                            <input name='confirmPassword' value={formData.confirmPassword} type="password" placeholder="Type here" onChange={handleChange} className="input input-bordered" required />
                        </div>
                        <div className='form-control items-center'>
                            <label htmlFor="DatePicker" className="mr-3 text-2xl text-white">Date of birth</label>
                            <DatePicker selected={dob} onChange={(date) => setDob(date || dob)}
                                className="p-3 text-white transition bg-primary-content border-2 rounded-md outline-none w-fulltext-lg border-neutral-800 focus:border-secondary focus:border-2 disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed" />
                        </div>
                        <div className='form-control'>
                            <label className="label">
                                <span className="label-text">Already have an account?
                                    <Link href='/login' > Login here</Link>
                                </span>
                            </label>
                        </div>
                        <div className="form-control">
                            <button type='submit' className="btn btn-primary" disabled={!matchPassword} >Register</button>
                        </div>
                        {/* <div className="form-control mt-2">
                            <button className="btn" onClick={loginWithGoogle}>
                                Login with Google
                                <FcGoogle className='ml-2' />
                            </button>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register