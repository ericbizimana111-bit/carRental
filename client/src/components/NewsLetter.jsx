import React, { useState } from 'react'
import ScrollReveal from './ScrollReveal'

const NewsLetter = () => {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = e => {
        e.preventDefault()
        setSubmitted(true)
        setEmail('')
    }

    return (
        <div className='my-10 mb-40 px-6 md:px-16 lg:px-24 xl:px-32'>
            <ScrollReveal>
                <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-blue-700 p-10 md:p-16 shadow-2xl shadow-primary/20'>
                    {/* Decorative circles */}
                    <div className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5' />
                    <div className='absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5' />
                    <div className='absolute right-1/4 top-1/4 h-24 w-24 rounded-full bg-white/5' />

                    <div className='relative z-10 flex flex-col items-center text-center'>
                        {/* Icon */}
                        <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm'>
                            <svg className='h-7 w-7 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' />
                            </svg>
                        </div>

                        <h2 className='text-2xl font-bold text-white md:text-3xl'>
                            Never Miss a Deal!
                        </h2>

                        <p className='mt-3 max-w-lg text-sm text-white/70 md:text-base'>
                            Subscribe to get the latest offers, new arrivals, and exclusive discounts delivered straight to your inbox.
                        </p>

                        {submitted ? (
                            <div className='mt-8 flex items-center gap-3 rounded-2xl bg-white/15 px-8 py-4 backdrop-blur-sm'>
                                <svg className='h-6 w-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                                </svg>
                                <span className='text-sm font-semibold text-white'>You're in! We'll keep you posted.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className='mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row'>
                                <div className='relative flex-1'>
                                    <svg className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' />
                                    </svg>
                                    <input
                                        type='email'
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder='Enter your email'
                                        className='h-12 w-full rounded-xl border border-white/20 bg-white/15 pl-10 pr-4 text-sm text-white placeholder-white/50 outline-none backdrop-blur-sm transition focus:border-white/40 focus:bg-white/20 focus:ring-2 focus:ring-white/20'
                                    />
                                </div>
                                <button
                                    type='submit'
                                    className='h-12 cursor-pointer rounded-xl bg-white px-8 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}

                        <p className='mt-4 text-xs text-white/40'>
                            No spam, unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}

export default NewsLetter