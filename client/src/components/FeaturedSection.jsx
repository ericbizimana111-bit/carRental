import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import api from '../services/api'
import ScrollReveal from './ScrollReveal'

const FeaturedSection = () => {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])

  useEffect(() => {
    api.get('/cars', { params: { limit: 4, sort: '-createdAt' } })
      .then(response => setCars(response.data.data || []))
      .catch(() => setCars([]))
  }, [])

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>
      <ScrollReveal>
        <Title title='Recent Vehicles' subTitle='Check out the latest cars just added to our fleet.' />
      </ScrollReveal>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-18 w-full'>
        {cars.map((car, index) => (
          <ScrollReveal key={car._id} delay={index * 100}>
            <div
              onClick={() => { navigate(`/car-details/${car._id}`); window.scrollTo(0, 0) }}
              className='group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-slate-200'
            >
              {/* Image */}
              <div className='relative h-48 overflow-hidden'>
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />
                <div className='absolute bottom-3 left-3 right-3 flex items-end justify-between'>
                  <div>
                    <h3 className='text-lg font-bold text-white drop-shadow-md'>
                      {car.brand} {car.model}
                    </h3>
                    <p className='text-xs text-white/80 font-medium mt-0.5'>
                      {car.year} · {car.category}
                    </p>
                  </div>
                  <div className='rounded-xl bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-lg'>
                    <span className='text-xs font-bold text-primary'>
                      {import.meta.env.VITE_CURRENCY}{car.pricePerDay}<span className='font-normal text-slate-400'>/day</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className='p-4'>
                {/* Specs row */}
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
                  <span className='text-xs font-semibold text-primary group-hover:underline transition-all'>
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={300}>
        <button onClick={() => {
          navigate('/cars')
          scrollTo(0, 0)
        }}
          className='flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer'
        >
          Explore all cars
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </ScrollReveal>
    </div>
  )
}

export default FeaturedSection
