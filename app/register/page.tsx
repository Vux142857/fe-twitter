'use client'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Button from '@/components/Button';
import { Bounce, toast } from "react-toastify";
const Register = () => {
    const router = useRouter()
    const [dob, setDob] = useState(new Date())
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [errorUsername, setErrorUsername] = useState('')
    useEffect(() => {
        if (confirmPassword !== password) {
            setError('Passwords do not match')
        } else if (password.length < 8) {
            setError('Password must be at least 8 characters')
        } else {
            setError('')
        }
    }, [error, password, confirmPassword])

    useEffect(() => {
        if (username.length < 3) {
            setErrorUsername('Username must be at least 3 characters')
        } else {
            setErrorUsername('')
        }
    }, [error, username])

    const [matchPassword, setMatchPassword] = useState(true)

    useEffect(() => {
        setMatchPassword(password === confirmPassword)
    }, [password, confirmPassword])

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
            const res = await signIn('Sign Up', {
                name,
                email,
                username,
                password,
                confirm_password: confirmPassword,
                date_of_birth: dob.toISOString(),
                redirect: false,
            })
            if (res?.error) {
                toast.warning('Register failure !', {
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
            } else {
                router.push('/resend')
            }
        } catch (error) {
            console.log(error)
        }
    }

    // const loginWithGoogle = () => { signIn('google', { callbackUrl: '/' }) }
    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://i.pinimg.com/originals/d2/e4/ed/d2e4ed3306b60642a22aceb4f49c6e9d.jpg)' }}>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <div className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">What is your name ?</span>
                            </label>
                            <input name='name' value={name} type="text" placeholder="Type here" className="input input-bordered" onChange={(e) => setName(e.target.value)} autoFocus required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input name='email' value={email} type="email" placeholder="Type here" className="input input-bordered" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input name='username' value={username} type="text" placeholder="Type here" className="input input-bordered" onChange={(e) => setUsername(e.target.value)} required />
                            {username.length > 0 && errorUsername && <span className='text-red-500'>{errorUsername}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input name='password' value={password} type="password" placeholder="Type here" className="input input-bordered" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className='form-control'>
                            <span className="label-text">Password with at least 8 characters.</span>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm password</span>
                            </label>
                            <input name='confirmPassword' value={confirmPassword} type="password" placeholder="Type here" onChange={(e) => setConfirmPassword(e.target.value)} className="input input-bordered" onKeyDown={handleKeyDown} required />
                            {confirmPassword.length > 0 && error && <span className='text-red-500'>{error}</span>}
                        </div>
                        <div className='form-control items-center'>
                            <label htmlFor="DatePicker" className="text-secondary">Date of birth</label>
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
                        <div className="form-control items-center">
                            <Button onClick={handleSubmit} disabled={!matchPassword} label='Register' type={'submit'} />
                        </div>
                        {/* <div className="form-control mt-2">
                            <button className="btn" onClick={loginWithGoogle}>
                                Login with Google
                                <FcGoogle className='ml-2' />
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register