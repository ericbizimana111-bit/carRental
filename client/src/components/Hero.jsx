import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'

const Hero = () => {
    const navigate = useNavigate()

    return (
        <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-8 bg-light px-6 py-14 text-center">
            <ScrollReveal>
                <h1 className="text-4xl font-semibold md:text-5xl">Luxury Cars On Rent</h1>
                <p className="max-w-xl text-sm text-slate-600 md:text-base mt-3">
                    Discover premium vehicles for every journey — from weekend getaways to business travel.
                </p>
            </ScrollReveal>

            {/* Car image as visual centerpiece */}
            <ScrollReveal delay={200}>
                <img src={assets.main_car} alt="Luxury rental car" className="max-h-80 w-full max-w-3xl object-contain" />
            </ScrollReveal>

            {/* Buttons directly beneath the car image */}
            <ScrollReveal delay={350}>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/cars" className="btn-primary min-w-[180px]">
                        Browse Cars
                    </Link>
                    <Link to="/owner/add-car" className="btn-secondary min-w-[180px]">
                        List Your Car
                    </Link>
                </div>
            </ScrollReveal>   
             
        </div>
    )
}

export default Hero
