import React from 'react'
import { Link } from 'react-router-dom'

const AuthShell = ({ mode, children }) => {
    const signIn = mode === 'signin'

    return (
        <div className="flex min-h-[calc(100vh-145px)] items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
            <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
                <div className={`order-2 flex flex-col justify-center bg-blue-600 p-8 text-white transition-all duration-500 md:p-12 ${signIn ? 'md:order-2' : 'md:order-1'}`}>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">CarRental</p>
                    <h2 className="mt-5 text-3xl font-semibold leading-tight">{signIn ? 'Your next drive starts here.' : 'Welcome back to the road.'}</h2>
                    <p className="mt-4 text-sm leading-6 text-blue-100">{signIn ? 'Create a renter or owner account and make every journey simpler.' : 'Sign in to manage your bookings, vehicles, and profile.'}</p>
                    <Link to={signIn ? '/signup' : '/login'} className="mt-8 w-fit rounded-full border border-white/70 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-blue-700">{signIn ? 'Create account' : 'Sign in'}</Link>
                </div>
                <div className={`order-1 p-7 sm:p-10 md:p-12 transition-all duration-500 ${signIn ? 'md:order-1' : 'md:order-2'}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthShell
