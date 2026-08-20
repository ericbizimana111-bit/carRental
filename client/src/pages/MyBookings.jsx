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

  const rentalDays = booking => Math.max(Math.ceil((new Date(booking.returnDate) - new Date(booking.pickupDate)) / 86400000), 1)

  return (
    <div className="page-container">
      <h1 className="page-title">My Bookings</h1>
      <p className="page-subtitle">View and manage your car rental reservations.</p>

      {message && <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p>}

      <div className="mt-8 space-y-5">
        {loading && (
          <div className="space-y-4" aria-label="Loading bookings">
            <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="card p-10 text-center">
            <p className="text-sm text-slate-500">You do not have any bookings yet.</p>
            <a href="/cars" className="btn-primary mt-4 inline-flex !rounded-lg">Browse available cars</a>
          </div>
        )}

        {bookings.map(booking => (
          <article key={booking._id} className="card overflow-hidden transition hover:shadow-md">
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full shrink-0 lg:w-56">
                <img
                  src={booking.car?.image || assets.car_image1}
                  alt={booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Unavailable car'}
                  className="h-44 w-full object-cover lg:h-full lg:min-h-[180px]"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 p-5 md:p-6 lg:flex-row">
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Car no longer available'}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {booking.car ? `${booking.car.year} · ${booking.car.category} · ${booking.car.location}` : 'Vehicle details unavailable'}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mt-4 space-y-2.5 text-sm text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <img src={assets.calendar_icon_colored} className="h-4 w-4" alt="" />
                      <span>
                        {new Date(booking.pickupDate).toLocaleDateString()} — {new Date(booking.returnDate).toLocaleDateString()}
                        <span className="ml-2 text-slate-400">({rentalDays(booking)} days)</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <img src={assets.location_icon_colored} className="h-4 w-4" alt="" />
                      <span>Pickup: {booking.pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <img src={assets.location_icon_colored} className="h-4 w-4" alt="" />
                      <span>Return: {booking.car?.location || 'Unavailable'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-4 lg:min-w-[160px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total price</p>
                    <p className="mt-1 text-2xl font-semibold text-primary">
                      {currency}{booking.totalPrice}
                    </p>
                  </div>

                  {['pending', 'confirmed'].includes(booking.status) && (
                    <button
                      disabled={cancellingId === booking._id}
                      onClick={() => setCancelId(booking._id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(cancelId)}
        title="Cancel this booking?"
        message="Are you sure you want to cancel this booking? This may release the vehicle for another renter."
        confirmLabel="Cancel booking"
        onConfirm={cancelBooking}
        onCancel={() => setCancelId(null)}
        busy={Boolean(cancellingId)}
      />
    </div>
  )
}

export default MyBookings
