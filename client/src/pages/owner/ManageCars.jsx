import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import api from '../../services/api'

const ManageCars = () => {
    const currency = import.meta.env.VITE_CURRENCY
    const [cars, setCars] = useState([])
    const [message, setMessage] = useState('')

    const loadCars = async () => {
        try {
            const response = await api.get('/cars/owner/list')
            setCars(response.data.data || [])
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to load cars')
        }
    }

    useEffect(() => { loadCars() }, [])

    const toggleAvailability = async car => {
        try {
            await api.put(`/cars/${car._id}`, { ...car, owner: undefined, isAvailable: !car.isAvailable })
            loadCars()
        } catch (error) { setMessage(error.response?.data?.message || 'Unable to update car') }
    }

    const deleteCar = async id => {
        if (!window.confirm('Delete this car from the platform?')) return
        try {
            await api.delete(`/cars/${id}`)
            loadCars()
        } catch (error) { setMessage(error.response?.data?.message || 'Unable to delete car') }
    }

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

                {message && <p className="p-4 text-xs text-red-500">{message}</p>}
                {cars.map(car => (
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
                            <button onClick={() => toggleAvailability(car)} className="hover:opacity-60" title="Toggle availability">
                                <img src={assets.eye_icon} className="w-4" alt="" />
                            </button>
                            <button onClick={() => deleteCar(car._id)} className="hover:opacity-60" title="Delete car">
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