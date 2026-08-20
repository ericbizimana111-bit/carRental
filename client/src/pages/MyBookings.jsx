import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import StatusBadge from '../components/StatusBadge'
import api from '../services/api'
import ConfirmModal from '../components/ConfirmModal'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [cancelId, setCancelId] = useState(null)

  const loadBookings = async () => {
    try {
      const response = await api.get('/bookings/my')
      setBookings(response.data.data || [])
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load bookings')
    } finally { setLoading(false) }
  }

  useEffect(() => { loadBookings() }, [])

  const cancelBooking = async () => {
    if (!cancelId) return
    const id = cancelId
    setCancellingId(id)
    setMessage('')
    try {
      await api.delete(`/bookings/${id}`)
      setCancelId(null)
      setBookings(current => current.map(booking => booking._id === id ? { ...booking, status: 'cancelled' } : booking))
    } catch (error) { setMessage(error.response?.data?.message || 'Unable to cancel booking') } finally { setCancellingId(null) }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <h1 className="text-2xl font-semibold text-gray-900">
        My Bookings
      </h1>

      <p className="text-xs text-gray-500 mt-1">
        View and manage your car bookings
      </p>

      <div className="mt-7 space-y-4">
        {loading && <div className="space-y-4" aria-label="Loading bookings"><div className="h-28 rounded-lg bg-gray-100 animate-pulse" /><div className="h-28 rounded-lg bg-gray-100 animate-pulse" /></div>}
        {message && <p className="text-sm text-red-500">{message}</p>}
        {!loading && !message && bookings.length === 0 && <p className="text-sm text-gray-500">You do not have any bookings yet.</p>}
        {bookings.map(booking => (
          <div
            key={booking._id}
            className="border border-gray-200 rounded-lg p-4 md:p-5 flex flex-col lg:flex-row gap-5"
          >
            <div className="w-full lg:w-32">
              <img
                src={booking.car?.image || '/vite.svg'}
                alt={booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Unavailable car'}
                className="w-full h-24 object-cover rounded-md"
              />

              <p className="text-xs font-medium mt-2">
                {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Car no longer available'}
              </p>

              <p className="text-[10px] text-gray-500">
                {booking.car ? `${booking.car.year} · ${booking.car.category} · ${booking.car.location}` : 'Vehicle details unavailable'}
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
                <span>Pickup Location: {booking.pickupLocation}</span>
              </div>

              <div className="flex items-center gap-2">
                <img src={assets.location_icon_colored} className="w-3" alt="" />
                <span>Return Location: {booking.car?.location || 'Unavailable'}</span>
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
                {currency}{booking.totalPrice}
              </p>
              {['pending', 'confirmed'].includes(booking.status) && <button disabled={cancellingId === booking._id} onClick={() => setCancelId(booking._id)} className="mt-3 rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 disabled:text-gray-300">{cancellingId === booking._id ? 'Cancelling...' : 'Cancel booking'}</button>}
              <p className="text-[10px] text-gray-500 mt-2">Rental days: {Math.max(Math.ceil((new Date(booking.returnDate) - new Date(booking.pickupDate)) / 86400000), 1)}</p>
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal open={Boolean(cancelId)} title="Cancel this booking?" message="Are you sure you want to cancel this booking? This may release the vehicle for another renter." confirmLabel="Cancel booking" onConfirm={cancelBooking} onCancel={() => setCancelId(null)} busy={Boolean(cancellingId)} />
    </div>
  )
}

export default MyBookings