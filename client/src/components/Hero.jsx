import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'


const Hero = () => {


    const [pickupLocation, setPickupLocation] = useState('')
    const navigate = useNavigate()



    return (
        <div className='min-h-[calc(100vh-72px)] flex flex-col items-center justify-center gap-8 bg-light px-6 py-14 text-center'>
            {/* | Class           | What it does                                    | Technical meaning                                                       |
                | --------------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
                | `text-4xl`      | Sets large text size (default)                  | Applies a font-size of **~2.25rem (36px)** and appropriate line-height  |
                | `md:text-5xl`   | Increases text size on medium screens and above | At the **`md` breakpoint (≥768px)**, font-size becomes **~3rem (48px)** |
                | `font-semibold` | Makes text semi-bold                            | Applies **font-weight: 600**                                            |
            */}

            <h1 className='text-4xl md:text-5xl font-semibold  '>Luxury Cars On Rent</h1>

            <form onSubmit={event => { event.preventDefault(); navigate('/cars') }} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg  md:rounded-full w-full max-w-80
             md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>
                <div className='flex flex-col items-start gap-2'>
                    <select className='outline-none' name="legion" id="location" required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
                        <option value="">Pickup Location</option>
                        {/*
                        if you forget key={city} react will warn you
                        map() returns an array of jsx elements
                        key={city} is the Unique identifier for React (important for performance & updates)
                        value={city} The value submitted when selected
                        */}
                        {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
                    </select>

                    <p className='px-1 text-sm text-gray-500 '>{pickupLocation ? pickupLocation : 'Please Select Location'}</p>
                    {/* | Class       | Size           |
                        | ----------- | -------------- |
                        | `text-xs`   | 12px           |
                        | `text-sm`   | 14px           |
                        | `text-base` | 16px (default) |
                        | `text-lg`   | 18px           |
                    */}
                </div>


                <div className='flex flex-col items-start gap-2'>
                    <label htmlFor='pickup-date'>Pickup-Date</label>
                    <input type='date' id='pickup-date' min={new Date().toLocaleDateString('en-CA')} className='text-sm text-gray-500' />
                    {/* en=enlgish  CA=CANADA */}
                </div>

                <div className='flex flex-col items-start gap-2'>
                    <label htmlFor='return-date'>Return Date</label>
                    <input type='date' id='return-date' min={new Date().toLocaleDateString('en-CA')} className='text-sm text-gray-500' />
                    {/* en=enlgish  CA=CANADA */}
                </div>

                <button className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer">
                    <img src={assets.search_icon} alt="search" className="brightness-300" />
                    <span>Search</span>
                </button>

            </form>

            <img src={assets.main_car} alt="maincar" className='max-h-74 w-full max-w-3xl object-contain' />
            <div className="flex flex-wrap justify-center gap-3">
                <Link to="/cars" className="rounded-full bg-blue-600 px-7 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">Browse Cars</Link>
                <Link to="/owner/add-car" className="rounded-full border border-blue-600 bg-white px-7 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-50">List Your Car</Link>
            </div>

        </div>
    )
}

export default Hero