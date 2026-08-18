import React from 'react'
import { assets, dummyCarData } from '../../assets/assets'

const ManageCars = () => {
    const currency = import.meta.env.VITE_CURRENCY

    return (
        <div className="p-6 md:p-8 max-w-6xl">
            <h1 className="text-2xl font-semibold">Manage Cars</h1>
            <p className="text-xs text-gray-500 mt-1">
                View all listed cars, update their details, or remove them from the booking platform
            </p>

            <div className="border rounded-lg overflow-hidden mt-7">
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-4 py-3 border-b text-[10px] text-gray-500">
                    <span>Car</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {dummyCarData.map(car => (
                    <div
                        key={car._id}
                        className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_80px] gap-3 md:gap-0 items-center px-4 py-3 border-b last:border-0"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={car.image}
                                className="w-10 h-8 object-cover rounded"
                                alt=""
                            />

                            <div>
                                <p className="text-xs">{car.brand} {car.model}</p>
                                <p className="text-[9px] text-gray-400">
                                    {car.seating_capacity} seats · {car.transmission}
                                </p>
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-600">
                            {car.category}
                        </p>

                        <p className="text-[10px] text-gray-600">
                            {currency}{car.pricePerDay}/day
                        </p>

                        <span className={`w-fit px-2.5 py-1 rounded-full text-[9px] ${car.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                            {car.isAvailable ? 'Available' : 'Not Available'}
                        </span>

                        <div className="flex items-center gap-4">
                            <button className="hover:opacity-60">
                                <img src={assets.eye_icon} className="w-4" alt="" />
                            </button>
                            <button className="hover:opacity-60">
                                <img src={assets.delete_icon} className="w-4" alt="" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageCars