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
            className="group rounded-xl overflow-hidden shadow-lg hover:translate-y-1 transition-all duration-500 cursor-pointer bg-white"
        >

            {/* ================= IMAGE SECTION ================= */}
            <div className="relative h-48 overflow-hidden">

                <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* ================= AVAILABILITY ================= */}
                {car.isAvailable ? (
                    <p className="absolute top-4 left-4 bg-green-600/90 text-white text-xs px-2.5 py-1 rounded-full">
                        Available Now
                    </p>
                ) : (
                    <p className="absolute top-4 left-4 bg-red-600/90 text-white text-xs px-2.5 py-1 rounded-full">
                        Not Available
                    </p>
                )}

                {/* ================= PRICE ================= */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">

                    <span className="font-semibold">
                        {currency}{car.pricePerDay}
                    </span>

                    <span className="text-sm text-white/80">
                        / day
                    </span>

                </div>

            </div>


            {/* ================= CAR INFORMATION ================= */}
            <div className="p-4 sm:p-5">

                {/* Car Name */}
                <div className="flex justify-between items-start mb-2">

                    <div>

                        <h3 className="text-lg font-medium">
                            {car.brand} {car.model}
                        </h3>

                        <p className="text-muted-foreground text-sm">
                            {car.category} ● {car.year}
                        </p>

                    </div>

                </div>


                {/* ================= CAR SPECIFICATIONS ================= */}
                <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-4">

                    {/* Seats */}
                    <div className="flex items-center text-sm text-muted-foreground">

                        <img
                            src={assets.users_icon}
                            alt="Seats"
                            className="h-4 w-4 mr-2"
                        />

                        <span>
                            {car.seating_capacity} Seats
                        </span>

                    </div>


                    {/* Fuel */}
                    <div className="flex items-center text-sm text-muted-foreground">

                        <img
                            src={assets.fuel_icon}
                            alt="Fuel"
                            className="h-4 w-4 mr-2"
                        />

                        <span>
                            {car.fuel_type}
                        </span>

                    </div>


                    {/* Transmission */}
                    <div className="flex items-center text-sm text-muted-foreground">

                        <img
                            src={assets.car_icon}
                            alt="Transmission"
                            className="h-4 w-4 mr-2"
                        />

                        <span>
                            {car.transmission}
                        </span>

                    </div>


                    {/* Location */}
                    <div className="flex items-center text-sm text-muted-foreground">

                        <img
                            src={assets.location_icon}
                            alt="Location"
                            className="h-4 w-4 mr-2"
                        />

                        <span>
                            {car.location}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default CarCard