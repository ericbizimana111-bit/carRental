import React from 'react'
import { assets, dummyMyBookingsData } from '../assets/assets'
import StatusBadge from '../components/StatusBadge'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <h1 className="text-2xl font-semibold text-gray-900">
        My Bookings
      </h1>

      <p className="text-xs text-gray-500 mt-1">
        View and manage your car bookings
      </p>

      <div className="mt-7 space-y-4">
        {dummyMyBookingsData.map(booking => (
          <div
            key={booking._id}
            className="border border-gray-200 rounded-lg p-4 md:p-5 flex flex-col lg:flex-row gap-5"
          >
            <div className="w-full lg:w-32">
              <img
                src={booking.car.image}
                alt=""
                className="w-full h-24 object-cover rounded-md"
              />

              <p className="text-xs font-medium mt-2">
                {booking.car.brand} {booking.car.model}
              </p>

              <p className="text-[10px] text-gray-500">
                {booking.car.year} · {booking.car.category} · {booking.car.location}
              </p>
            </div>

            <div className="flex-1 text-[10px] text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <img src={assets.calendar_icon_colored} className="w-3" alt="" />
                <span>
                  Rental Period: {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <img src={assets.location_icon_colored} className="w-3" alt="" />
                <span>Pickup Location: {booking.car.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <img src={assets.location_icon_colored} className="w-3" alt="" />
                <span>Return Location: {booking.car.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Booking Status:</span>
                <StatusBadge status={booking.status} />
              </div>
            </div>

            <div className="lg:text-right">
              <p className="text-[10px] text-gray-500">
                Total Price
              </p>

              <p className="text-lg font-semibold text-blue-600">
                {currency}{booking.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings