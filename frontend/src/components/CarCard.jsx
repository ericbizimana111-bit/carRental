import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'

const CarCard = ({ car, ownerMode = false, onDelete }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const handleCardClick = () => {
        if (ownerMode) return
        navigate(`/car-details/${car._id}`)
        window.scrollTo(0, 0)
    }

    const stopPropagation = event => event.stopPropagation()

    return (
        <div
            onClick={handleCardClick}
            className={`group card overflow-hidden transition-all duration-300 ${ownerMode ? '' : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'}`}
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <p className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white ${car.isAvailable ? 'bg-primary' : 'bg-red-500'}`}>
                    {car.isAvailable ? 'Available Now' : 'Not Available'}
                </p>
                <div className="absolute bottom-3 right-3 rounded-lg bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white">
                    {currency}{car.pricePerDay}/day
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-base font-semibold text-slate-900">
                    {car.brand} {car.model}
                </h3>

                <p className="mt-1 text-base text-slate-500">
                    {car.category} · {car.year}
                </p>

                <div className="mt-3 flex items-center justify-between text-base">
                    <span className="flex items-center gap-1.5 text-slate-500">
                        <img src={assets.user_profile} alt="" className="h-4 w-4 rounded-full object-cover opacity-70" />
                        {car.owner?.name || 'Car owner'}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-amber-600">
                        <img src={assets.star_icon} alt="" className="h-3.5 w-3.5" />
                        {car.rating ? `${car.rating}/5` : 'New'}
                    </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-2.5 text-base text-slate-500">
                    <div className="flex items-center gap-2">
                        <img src={assets.users_icon} className="h-4 w-4 opacity-70" alt="" />
                        {car.seating_capacity} Seats
                    </div>
                    <div className="flex items-center gap-2">
                        <img src={assets.fuel_icon} className="h-4 w-4 opacity-70" alt="" />
                        {car.fuel_type}
                    </div>
                    <div className="flex items-center gap-2">
                        <img src={assets.car_icon} className="h-4 w-4 opacity-70" alt="" />
                        {car.transmission}
                    </div>
                    <div className="flex items-center gap-2">
                        <img src={assets.location_icon} className="h-4 w-4 opacity-70" alt="" />
                        {car.location}
                    </div>
                </div>

                {ownerMode && (
                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4" onClick={stopPropagation}>
                        <Link
                            to={`/owner/edit-car/${car._id}`}
                            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary/30 hover:bg-blue-50"
                        >
                            Edit
                        </Link>
                        <button
                            type="button"
                            onClick={() => onDelete?.(car._id)}
                            className="inline-flex flex-1 items-center justify-center rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CarCard
