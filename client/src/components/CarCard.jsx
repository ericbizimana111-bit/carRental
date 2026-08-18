import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({ car }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    return (
        <div
            onClick={() => {
                navigate(`/car-details/${car._id}`)
                window.scrollTo(0, 0)
            }}
            className="group bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <p className={`absolute top-3 left-3 ${car.isAvailable ? 'bg-blue-600' : 'bg-red-500'} text-white text-[10px] px-2.5 py-1 rounded-full`}>
                    {car.isAvailable ? 'Available Now' : 'Not Available'}
                </p>
                <div className="absolute bottom-3 right-3 bg-black text-white px-2.5 py-1 rounded-md text-[10px]">
                    {currency}{car.pricePerDay}/day
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                    {car.brand} {car.model}
                </h3>

                <p className="text-[10px] text-gray-500 mt-0.5">
                    {car.category} {car.year}
                </p>

                <div className="grid grid-cols-2 gap-y-2 mt-3 text-[10px] text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <img src={assets.users_icon} className="w-3 h-3" alt="" />
                        {car.seating_capacity} Seats
                    </div>
                    <div className="flex items-center gap-1.5">
                        <img src={assets.fuel_icon} className="w-3 h-3" alt="" />
                        {car.fuel_type}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <img src={assets.car_icon} className="w-3 h-3" alt="" />
                        {car.transmission}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <img src={assets.location_icon} className="w-3 h-3" alt="" />
                        {car.location}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarCard