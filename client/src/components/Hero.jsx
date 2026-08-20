import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'

const Hero = () => {
    const [pickupLocation, setPickupLocation] = useState('')
    const navigate = useNavigate()

    return (
        <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-8 bg-light px-6 py-14 text-center">
            <h1 className="text-4xl font-semibold md:text-5xl">Luxury Cars On Rent</h1>
            <p className="max-w-xl text-sm text-slate-600 md:text-base">
                Discover premium vehicles for every journey — from weekend getaways to business travel.
            </p>

            <form
                onSubmit={event => { event.preventDefault(); navigate('/cars') }}
                className="flex w-full max-w-4xl flex-col items-stretch justify-between gap-4 rounded-2xl bg-white p-6 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] md:flex-row md:items-center md:rounded-full md:px-8"
            >
                <div className="flex flex-col items-start gap-1.5 md:min-w-[140px]">
                    <label htmlFor="location" className="text-xs font-medium text-slate-500">Pickup Location</label>
                    <select
                        className="w-full bg-transparent text-sm outline-none"
                        name="location"
                        id="location"
                        required
                        value={pickupLocation}
                        onChange={e => setPickupLocation(e.target.value)}
                    >
                        <option value="">Select city</option>
                        {cityList.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>

                <div className="flex flex-col items-start gap-1.5">
                    <label htmlFor="pickup-date" className="text-xs font-medium text-slate-500">Pickup Date</label>
                    <input type="date" id="pickup-date" min={new Date().toLocaleDateString('en-CA')} className="text-sm text-slate-600 outline-none" />
                </div>

                <div className="flex flex-col items-start gap-1.5">
                    <label htmlFor="return-date" className="text-xs font-medium text-slate-500">Return Date</label>
                    <input type="date" id="return-date" min={new Date().toLocaleDateString('en-CA')} className="text-sm text-slate-600 outline-none" />
                </div>

                <button type="submit" className="btn-primary mt-2 gap-2 md:mt-0">
                    <img src={assets.search_icon} alt="" className="h-4 w-4 brightness-200" />
                    Search
                </button>
            </form>

            <img src={assets.main_car} alt="Luxury rental car" className="max-h-80 w-full max-w-3xl object-contain" />

            <div className="flex flex-wrap justify-center gap-4">
                <Link to="/cars" className="btn-primary min-w-[160px]">
                    Browse Cars
                </Link>
                <Link to="/owner/add-car" className="btn-secondary min-w-[160px]">
                    List Your Car
                </Link>
            </div>
        </div>
    )
}

export default Hero
