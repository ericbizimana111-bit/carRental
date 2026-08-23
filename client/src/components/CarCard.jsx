import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import StarRating from './StarRating'

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
            className={`group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 ${ownerMode ? '' : 'cursor-pointer hover:shadow-xl hover:border-slate-200'}`}
        >
            {/* Image */}
            <div className='relative h-52 overflow-hidden'>
                <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

                {/* Availability badge */}
                <div className='absolute top-3 left-3'>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg ${car.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${car.isAvailable ? 'bg-white animate-pulse' : 'bg-white/70'}`} />
                        {car.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                </div>

                {/* Price */}
                <div className='absolute top-3 right-3 rounded-xl bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-lg'>
                    <span className='text-sm font-bold text-primary'>
                        {currency}{car.pricePerDay}<span className='font-normal text-slate-400 text-xs'>/day</span>
                    </span>
                </div>

                {/* Name on image */}
                <div className='absolute bottom-3 left-3 right-3'>
                    <h3 className='text-lg font-bold text-white drop-shadow-md'>
                        {car.brand} {car.model}
                    </h3>
                    <p className='text-xs text-white/80 font-medium mt-0.5'>
                        {car.year} · {car.category}
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className='p-4'>
                {/* Owner + Rating */}
                <div className='flex items-center justify-between'>
                    <span className='flex items-center gap-2 text-sm text-slate-600'>
                        <img src={assets.user_profile} alt='' className='h-6 w-6 rounded-full object-cover ring-2 ring-slate-100' />
                        {car.owner?.name || 'Car owner'}
                    </span>
                    <StarRating rating={car.rating} count={car.ratingCount} showValue={true} />
                </div>

                {/* Divider */}
                <div className='my-3 border-t border-slate-100' />

                {/* Specs */}
                <div className='flex items-center justify-between text-xs text-slate-500'>
                    <span className='flex items-center gap-1'>
                        <img src={assets.users_icon} className='h-3.5 w-3.5 opacity-60' alt='' />
                        {car.seating_capacity} Seats
                    </span>
                    <span className='flex items-center gap-1'>
                        <img src={assets.fuel_icon} className='h-3.5 w-3.5 opacity-60' alt='' />
                        {car.fuel_type}
                    </span>
                    <span className='flex items-center gap-1'>
                        <img src={assets.car_icon} className='h-3.5 w-3.5 opacity-60' alt='' />
                        {car.transmission}
                    </span>
                </div>

                {/* Divider */}
                <div className='my-3 border-t border-slate-100' />

                {/* Location + CTA */}
                <div className='flex items-center justify-between'>
                    <span className='flex items-center gap-1 text-xs text-slate-400'>
                        <img src={assets.location_icon} className='h-3 w-3 opacity-50' alt='' />
                        {car.location}
                    </span>
                    {!ownerMode && (
                        <span className='text-xs font-semibold text-primary group-hover:underline transition-all'>
                            View Details →
                        </span>
                    )}
                </div>

                {/* Owner mode buttons */}
                {ownerMode && (
                    <div className='mt-4 flex gap-2 border-t border-slate-100 pt-4' onClick={stopPropagation}>
                        <Link
                            to={`/owner/edit-car/${car._id}`}
                            className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary/30 hover:bg-blue-50'
                        >
                            Edit
                        </Link>
                        <button
                            type='button'
                            onClick={() => onDelete?.(car._id)}
                            className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50'
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
