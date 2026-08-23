import React, { useEffect, useState } from 'react'
import Title from './Title'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import ScrollReveal from './ScrollReveal'

const FeaturedSection = () => {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])

  useEffect(() => {
    api.get('/cars', { params: { limit: 6, isAvailable: true } })
      .then(response => setCars(response.data.data || []))
      .catch(() => setCars([]))
  }, [])

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>
      <ScrollReveal>
        <Title title='Featured Vehicles' subTitle='Explore our selection of premium vehicles available for your next adventure.' />
      </ScrollReveal>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
        {cars.map((car, index) => (
          <ScrollReveal key={car._id} delay={index * 100}>
            <CarCard car={car} />
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
