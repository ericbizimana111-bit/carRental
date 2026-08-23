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
                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300 p-10 md:p-16'>

                    <div className='relative z-10 flex flex-col items-center text-center'>
                        {/* Icon */}
                        <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10'>
                            <svg className='h-5 w-5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' />
                            </svg>
                        </div>

                        <h2 className='text-2xl font-bold text-white md:text-3xl'>
                            Never Miss a Deal
                        </h2>

                        <p className='mt-3 max-w-lg text-sm text-white/80 md:text-base'>
                            Subscribe to get the latest offers, new arrivals, and exclusive discounts delivered straight to your inbox.
                        </p>

                        {submitted ? (
                            <div className='mt-8 flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-8 py-4'>
                                <svg className='h-5 w-5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
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
                                        className='h-12 w-full rounded-lg border border-white/30 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-white focus:ring-2 focus:ring-white/30'
                                    />
                                </div>
                                <button
                                    type='submit'
                                    className='h-12 cursor-pointer rounded-lg bg-white px-8 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50'
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}

                        <p className='mt-4 text-xs text-white/60'>
                            No spam, unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}

export default NewsLetter