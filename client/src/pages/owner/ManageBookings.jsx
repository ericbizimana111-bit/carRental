import React, { useEffect, useState } from 'react'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import api from '../../services/api'

const ManageBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY
    const [bookings, setBookings] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)
    const [confirmAction, setConfirmAction] = useState(null)

    useEffect(() => {
        let active = true
        api.get('/bookings/owner')
            .then(response => { if (active) setBookings(response.data.data || []) })
            .catch(error => { if (active) setMessage(error.response?.data?.message || 'Unable to load bookings') })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [])

    const updateStatus = async (id, status) => {
        setUpdatingId(id)
        setMessage('')
        try {
            const response = await api.put(`/bookings/${id}/status`, { status })
            setBookings(current => current.map(booking => booking._id === id ? response.data.data : booking))
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to update booking')
        } finally {
            setUpdatingId(null)
            setConfirmAction(null)
        }
    }

    return (
        <div className="p-6 md:p-8 max-w-6xl">
            <h1 className="text-2xl font-semibold">Manage Bookings</h1>
            <p className="text-xs text-gray-500 mt-1">
                Track all customer bookings, approve or cancel requests, and manage booking statuses
            </p>

            <div className="border rounded-lg overflow-hidden mt-7">
                <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_120px] px-4 py-3 border-b text-[10px] text-gray-500">
                    <span>Car</span>
                    <span>Date Range</span>
                    <span>Total</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {loading && <p className="p-4 text-xs text-gray-500">Loading bookings...</p>}
                {!loading && !message && bookings.length === 0 && <p className="p-4 text-xs text-gray-500">No bookings for your cars yet.</p>}
                {message && <p className="p-4 text-xs text-red-500">{message}</p>}
                {bookings.map(booking => (
                    <div
                        key={booking._id}
                        data-testid="booking-row"
                        className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_120px] gap-3 md:gap-0 items-center px-4 py-3 border-b last:border-0"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={booking.car?.image || '/vite.svg'}
                                className="w-10 h-8 object-cover rounded"
                                alt={booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Unavailable car'}
                            />
                            <div>
                                <p className="text-xs">
                                    {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Car no longer available'}
                                </p>
                                <p className="text-[9px] text-gray-400">{booking.user?.name}</p>
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-600">
                            {new Date(booking.pickupDate).toLocaleDateString()} To {new Date(booking.returnDate).toLocaleDateString()}
                        </p>

                        <p className="text-[10px]">
                            {currency}{booking.totalPrice}
                        </p>

                        <StatusBadge status={booking.status} />

                        <div className="flex gap-2">
                            {booking.status === 'pending' && (
                                <button
                                    disabled={updatingId === booking._id}
                                    onClick={() => setConfirmAction({ id: booking._id, status: 'confirmed' })}
                                    className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-medium text-white disabled:opacity-50"
                                >
                                    Accept
                                </button>
                            )}
                            {booking.status === 'pending' && (
                                <button
                                    disabled={updatingId === booking._id}
                                    onClick={() => setConfirmAction({ id: booking._id, status: 'cancelled' })}
                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-[10px] font-medium text-red-600 disabled:opacity-50"
                                >
                                    Decline
                                </button>
                            )}
                            {booking.status === 'confirmed' && (
                                <button
                                    disabled={updatingId === booking._id}
                                    onClick={() => updateStatus(booking._id, 'completed')}
                                    className="rounded-lg border border-green-200 px-3 py-1.5 text-[10px] font-medium text-green-600 disabled:opacity-50"
                                >
                                    Complete
                                </button>
                            )}
                            {booking.status === 'confirmed' && (
                                <button
                                    disabled={updatingId === booking._id}
                                    onClick={() => setConfirmAction({ id: booking._id, status: 'cancelled' })}
                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-[10px] font-medium text-red-600 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {confirmAction && (
                <ConfirmModal
                    open={true}
                    title={confirmAction.status === 'confirmed' ? 'Accept this booking?' : 'Decline this booking?'}
                    message={confirmAction.status === 'confirmed'
                        ? 'Do you agree with this booking? The renter will be notified.'
                        : 'Are you sure you want to decline this booking? The renter will be notified.'}
                    confirmLabel={confirmAction.status === 'confirmed' ? 'Accept' : 'Decline'}
                    onConfirm={() => updateStatus(confirmAction.id, confirmAction.status)}
                    onCancel={() => setConfirmAction(null)}
                    busy={Boolean(updatingId)}
                />
            )}
        </div>
    )
}

export default ManageBookings
