import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  useEffect(() => {
    setCar(dummyCarData.find(item => item._id === id))
  }, [id])

  if (!car) {
    return <p className="mt-20 text-center text-gray-500">Car not found</p>
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
      <button
        onClick={() => navigate('/cars')}
        className="flex items-center gap-2 text-xs text-gray-500 mb-5"
      >
        <img src={assets.arrow_icon} className="w-3 rotate-180" alt="" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_190px] gap-6">
        <div>
          <div className="rounded-lg overflow-hidden">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-[350px] md:h-[430px] object-cover"
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mt-4">
            {car.brand} {car.model}
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            {car.year} · {car.category}
          </p>

          <div className="border-b border-gray-200 mt-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <img src={assets.users_icon} className="w-4 h-4 mx-auto mb-2" alt="" />
              <p className="text-xs">{car.seating_capacity} Seats</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <img src={assets.fuel_icon} className="w-4 h-4 mx-auto mb-2" alt="" />
              <p className="text-xs">{car.fuel_type}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <img src={assets.car_icon} className="w-4 h-4 mx-auto mb-2" alt="" />
              <p className="text-xs">{car.transmission}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <img src={assets.location_icon} className="w-4 h-4 mx-auto mb-2" alt="" />
              <p className="text-xs">{car.location}</p>
            </div>
          </div>

          <h2 className="font-medium text-sm mt-5">Description</h2>
          <p className="text-xs text-gray-500 leading-5 mt-2">
            {car.description}
          </p>

          <h2 className="font-medium text-sm mt-5">Features</h2>

          <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
            <p className="flex items-center gap-2">
              <img src={assets.check_icon} className="w-3" alt="" />
              Leather Seats
            </p>
            <p className="flex items-center gap-2">
              <img src={assets.check_icon} className="w-3" alt="" />
              Panoramic Sunroof
            </p>
            <p className="flex items-center gap-2">
              <img src={assets.check_icon} className="w-3" alt="" />
              Wireless Charging
            </p>
            <p className="flex items-center gap-2">
              <img src={assets.check_icon} className="w-3" alt="" />
              360 Camera
            </p>
          </div>
        </div>

        <div className="border border-gray-100 shadow-lg rounded-lg p-4 h-fit">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-xl font-semibold">
              {import.meta.env.VITE_CURRENCY}{car.pricePerDay}
            </h2>
            <span className="text-[10px] text-gray-500">per day</span>
          </div>

          <div className="mt-5">
            <label className="text-[10px]">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={e => setPickupDate(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-2 py-2 mt-1 text-xs outline-none"
            />
          </div>

          <div className="mt-3">
            <label className="text-[10px]">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-2 py-2 mt-1 text-xs outline-none"
            />
          </div>

          <button
            disabled={!car.isAvailable}
            className="w-full bg-primary disabled:bg-gray-300 text-white rounded-md py-2 mt-5 text-xs"
          >
            Book Now
          </button>

          <p className="text-[9px] text-gray-400 text-center mt-3">
            No credit card required to reserve
          </p>
        </div>
      </div>
    </div>
  )
}

export default CarDetails