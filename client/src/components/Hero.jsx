import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'

const stats = [
    { label: 'Cities', value: '4+', icon: '🏙️' },
    { label: 'Cars Available', value: '50+', icon: '🚗' },
    { label: 'Happy Renters', value: '2K+', icon: '⭐' },
]

const Hero = () => {
    const navigate = useNavigate()

    return (
        <div className='relative overflow-hidden bg-light'>
            {/* Decorative gradient blobs */}
            <div className='pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl' />
            <div className='pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-blue-200/30 blur-3xl' />

            <div className='relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col items-center gap-8 px-6 py-14 md:flex-row md:items-start md:gap-6 lg:px-12 xl:px-16'>

                {/* Left: Copy */}
                <div className='flex flex-1 flex-col items-center text-center md:items-start md:text-left'>
                    <ScrollReveal delay={100}>
                        <h1 className='mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-[3.25rem]'>
                            Find Your Perfect
                            <br />
                            <span className='bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent'>
                                Drive Today
                            </span>
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <p className='mt-5 max-w-lg text-sm leading-relaxed text-slate-500 md:text-base'>
                            Discover premium vehicles for every journey — from weekend getaways to business travel. Browse, book, and drive with confidence.
                        </p>
                    </ScrollReveal>

                    {/* CTA Buttons */}
                    <ScrollReveal delay={300}>
                        <div className='mt-8 flex flex-wrap items-center gap-4'>
                            <Link
                                to='/cars'
                                className='inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dull hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]'
                            >
                                Browse Cars
                                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                                </svg>
                            </Link>
                            <Link
                                to='/owner/add-car'
                                className='inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white px-7 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]'
                            >
                                List Your Car
                            </Link>
                        </div>
                    </ScrollReveal>

                    {/* Trust stats */}
                    <ScrollReveal delay={400}>
                        <div className='mt-10 flex items-center gap-8'>
                            {stats.map((stat, i) => (
                                <div key={i} className='flex flex-col items-center md:items-start'>
                                    <span className='text-xl font-bold text-slate-900'>
                                        {stat.value}
                                    </span>
                                    <span className='text-xs text-slate-400'>
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                            <div className='hidden h-8 w-px bg-slate-200 md:block' />
                            <div className='hidden items-center gap-2 md:flex'>
                                <div className='flex -space-x-2'>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className='h-7 w-7 rounded-full border-2 border-white bg-slate-200' />
                                    ))}
                                </div>
                                <span className='text-xs text-slate-500'>Join 2K+ happy renters</span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right: Car image */}
                <ScrollReveal delay={250} className='flex flex-1 items-center justify-center pt-10'>
                    <div className='animate-[drive_4s_ease-in-out_infinite] relative'>
                        <img
                            src={assets.main_car}
                            alt='Luxury rental car'
                            className='w-full max-w-lg object-contain drop-shadow-2xl'
                        />
                        {/* Front wheel */}
                        <div className='absolute bottom-[18%] right-[12%] h-[14%] w-[14%] rounded-full border-[3px] border-slate-400/40 border-t-slate-600/50 border-r-slate-600/50 animate-[spin-wheel_1s_linear_infinite]' />
                        {/* Rear wheel */}
                        <div className='absolute bottom-[18%] left-[15%] h-[14%] w-[14%] rounded-full border-[3px] border-slate-400/40 border-t-slate-600/50 border-r-slate-600/50 animate-[spin-wheel_1s_linear_infinite]' />
                    </div>
                </ScrollReveal>
            </div>
        </div>
    )
}

export default Hero
