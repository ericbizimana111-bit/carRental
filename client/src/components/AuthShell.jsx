import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const SocialIcons = () => (
    <div className="mt-8 flex items-center gap-4">
        {[assets.facebook_logo, assets.instagram_logo, assets.twitter_logo, assets.gmail_logo].map((icon, index) => (
            <span key={index} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25">
                <img src={icon} alt="" className="h-4 w-4 brightness-200" />
            </span>
        ))}
    </div>
)

const AuthShell = ({ mode, children }) => {
    const signIn = mode === 'signin'

    return (
        <div className="flex min-h-[calc(100vh-145px)] items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                <div className="grid md:grid-cols-2">
                    {/* Form panel */}
                    <div
                        className={`relative z-10 bg-white p-7 transition-all duration-700 ease-in-out sm:p-10 md:p-12 ${signIn ? 'md:order-1' : 'md:order-2'}`}
                    >
                        {children}
                    </div>

                    {/* Accent panel — slides to opposite side */}
                    <div
                        className={`relative flex flex-col justify-center overflow-hidden bg-primary p-8 text-white transition-all duration-700 ease-in-out md:p-12 ${signIn ? 'md:order-2' : 'md:order-1'}`}
                    >
                        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
                        <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-white/5" />

                        <div className="relative">
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-200">CarRental</p>
                            <h2 className="mt-5 text-3xl font-semibold leading-tight">
                                {signIn ? 'Welcome back to the road.' : 'Join the CarRental community.'}
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-blue-100">
                                {signIn
                                    ? 'Sign in to manage your bookings, listed vehicles, and profile — all in one place.'
                                    : 'Create an account to browse premium rentals or start earning by listing your own vehicle.'}
                            </p>
                            <Link
                                to={signIn ? '/signup' : '/login'}
                                className="mt-8 inline-flex w-fit rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-primary"
                            >
                                {signIn ? 'Create Account' : 'Sign In'}
                            </Link>
                            <SocialIcons />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthShell
