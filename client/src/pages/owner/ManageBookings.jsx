import React from 'react'
import { dummyMyBookingsData } from '../../assets/assets'
import StatusBadge from '../../components/StatusBadge'

const ManageBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY

    return (
        <div className="p-6 md:p-8 max-w-6xl">
            <h1 className="text-2xl font-semibold">Manage Bookings</h1>
            <p className="text-xs text-gray-500 mt-1">
                Track all customer bookings, approve or cancel requests, and manage booking statuses
            </p>

            <div className="border rounded-lg overflow-hidden mt-7">
                <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_80px] px-4 py-3 border-b text-[10px] text-gray-500">
                    <span>Car</span>
                    <span>Date Range</span>
                    <span>Total</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {dummyMyBookingsData.map(booking => (
                    <div
                        key={booking._id}
                        className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_80px] gap-3 md:gap-0 items-center px-4 py-3 border-b last:border-0"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={booking.car.image}
                                className="w-10 h-8 object-cover rounded"
                                alt=""
                            />
                            <p className="text-xs">
                                {booking.car.brand} {booking.car.model}
                            </p>
                        </div>

                        <p className="text-[10px] text-gray-600">
                            {new Date(booking.pickupDate).toLocaleDateString()} To {new Date(booking.returnDate).toLocaleDateString()}
                        </p>

                        <p className="text-[10px]">
                            {currency}{booking.price}
                        </p>

                        <StatusBadge status={booking.status} />

                        <button className="border rounded px-2 py-1 text-[9px] text-gray-500 w-fit">
                            Cancel
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageBookings