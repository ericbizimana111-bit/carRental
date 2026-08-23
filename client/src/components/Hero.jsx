import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'

const stats = [
    { label: 'Cities', value: '4+' },
    { label: 'Cars Available', value: '50+' },
    { label: 'Happy Renters', value: '2K+' },
]

const carImages = [
    { src: assets.car_image1, name: 'Mercedes-Benz C-Class' },
    { src: assets.car_image2, name: 'Audi Q7' },
    { src: assets.car_image3, name: 'BMW X5' },
    { src: assets.car_image4, name: 'Porsche Cayenne' },
]

const Hero = () => {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % carImages.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className='relative overflow-hidden bg-light border-b border-slate-100'>

            <div className='relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col items-center gap-8 px-6 py-14 md:flex-row md:items-start md:gap-6 lg:px-12 xl:px-16'>

                {/* Left: Copy */}
                <div className='flex flex-1 flex-col items-center text-center md:items-start md:text-left'>
                    <ScrollReveal delay={100}>
                        <span className='text-xl font-bold text-primary'>
                            Car Rental, Simplified
                        </span>
                        <h1 className='mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl lg:text-[3.25rem]'>
                            Find Your Perfect
                            <br />
                            Drive Today
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <p className='mt-5 max-w-lg text-sm leading-relaxed text-slate-500 md:text-base'>
                            Discover premium vehicles for every journey — from weekend getaways to business travel. Browse, book, and drive with confidence.
                        </p>
                    </ScrollReveal>

                    {/* CTA Buttons */}
                    <ScrollReveal delay={300}>
                        <div className='mt-8 flex flex-wrap items-center gap-3'>
                            <Link
                                to='/cars'
                                className='inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dull'
                            >
                                Browse Cars
                                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                                </svg>
                            </Link>
                            <Link
                                to='/owner/add-car'
                                className='inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50'
                            >
                                List Your Car
                            </Link>
                        </div>
                    </ScrollReveal>

                    {/* Trust stats */}
                    <ScrollReveal delay={400}>
                        <div className='mt-10 flex items-center gap-8 border-t border-slate-100 pt-6'>
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
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right: Car rotation showcase */}
                <ScrollReveal delay={250} className='flex flex-1 items-center justify-center pt-10'>
                    <div className='relative w-full max-w-lg'>
                        {/* Fixed-size container with background */}
                        <div className='relative h-[320px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:h-[360px]'>
                            {/* Car images stack */}
                            {carImages.map((car, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${i === current
                                            ? 'z-10 opacity-100 translate-x-0 scale-100'
                                            : i < current
                                                ? 'z-0 opacity-0 -translate-x-8 scale-95'
                                                : 'z-0 opacity-0 translate-x-8 scale-95'
                                        }`}
                                >
                                    <img
                                        src={car.src}
                                        alt={car.name}
                                        className='h-full w-full rounded-xl object-contain p-6'
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Car name label */}
                        <div className='absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-5 py-2 shadow-sm'>
                            <p className='text-sm font-semibold text-slate-900 whitespace-nowrap'>
                                {carImages[current].name}
                            </p>
                        </div>

                        {/* Dot indicators */}
                        <div className='absolute -bottom-11 left-1/2 z-20 flex -translate-x-1/2 gap-2'>
                            {carImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    aria-label={`Show ${carImages[i].name}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-primary' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    )
}

export default Hero