import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import StatusBadge from '../../components/StatusBadge'
import api from '../../services/api'

const Dashboard = () => {
    const [data, setData] = useState({ totalCars: 0, totalBookings: 0, pendingBookings: 0, completedBookings: 0, recentBookings: [], monthlyRevenue: 0 })
    const currency = import.meta.env.VITE_CURRENCY
    const [error, setError] = useState('')
    useEffect(() => { api.get('/bookings/owner/dashboard').then(response => setData(response.data.data)).catch(error => setError(error.response?.data?.message || 'Unable to load dashboard')) }, [])

    return (
        <div className="p-6 md:p-8 max-w-6xl">
            <h1 className="text-2xl font-semibold">
                Admin Dashboard
            </h1>

            <p className="text-xs text-gray-500 mt-1">
                Monitor overall platform performance including total cars, bookings, revenue, and recent activities.
            </p>

            {error && <p className="text-xs text-red-500 mt-4">{error}</p>}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
                <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500">Total Cars</p>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xl font-semibold">{data.totalCars}</p>
                        <img src={assets.carIconColored} className="w-6" alt="" />
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500">Total Bookings</p>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xl font-semibold">{data.totalBookings}</p>
                        <img src={assets.calendar_icon_colored} className="w-6" alt="" />
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500">Pending Bookings</p>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xl font-semibold">{data.pendingBookings}</p>
                        <img src={assets.cautionIconColored} className="w-6" alt="" />
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500">Completed Bookings</p>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xl font-semibold">{data.completedBookings}</p>
                        <img src={assets.check_icon} className="w-6" alt="" />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5 mt-5">
                <div className="border rounded-lg p-5">
                    <h2 className="font-medium text-sm">Recent Bookings</h2>
                    <p className="text-[10px] text-gray-500 mt-1">Latest customer bookings</p>

                    <div className="mt-5">
                        {data.recentBookings.map(booking => (
                            <div key={booking._id} className="flex items-center gap-3 py-3 border-b last:border-0">
                                <div className="bg-blue-50 p-2 rounded">
                                    <img src={assets.carIconColored} className="w-3" alt="" />
                                </div>

                                <div className="flex-1">
                                    <p className="text-xs">{booking.car.brand} {booking.car.model}</p>
                                    <p className="text-[9px] text-gray-400">
                                        {new Date(booking.pickupDate).toLocaleDateString()}
                                    </p>
                                </div>

                                <p className="text-xs">{currency}{booking.totalPrice}</p>
                                <StatusBadge status={booking.status} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border rounded-lg p-5 h-fit">
                    <h2 className="font-medium text-sm">Monthly Revenue</h2>
                    <p className="text-[10px] text-gray-500 mt-1">Revenue for current month</p>
                    <p className="text-2xl font-semibold text-blue-600 mt-5">
                        {currency}{data.monthlyRevenue}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard