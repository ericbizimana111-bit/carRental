import React, { useEffect, useState } from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import CarCard from './CarCard';
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const FeaturedSection = () => {

  const navigate = useNavigate();
  const [cars, setCars] = useState([])

  useEffect(() => {
    api.get('/cars', { params: { limit: 6, isAvailable: true, featured: true } })
      .then(response => setCars(response.data.data || []))
      .catch(() => setCars([]))
  }, [])


  if (cars.length === 0) return null

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>

      <div>
        <Title title='Featured Vehicles' subTitle='Explore our selection of premium vehicles available for your next adventure.' />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
        {
          cars.map((car) => (
            <div key={car._id}>
              <CarCard car={car} />
            </div>
          ))
        }
      </div>

      <button onClick={() => {
        navigate('/cars');
        scrollTo(0, 0)
      }}
        className='flex items-center justify-center gap-2 px-6 py-2 border
         border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer'>
        Explore all cars <img src={assets.arrow_icon} alt="arrow" />
      </button>

    </div>
  )
}

export default FeaturedSection 