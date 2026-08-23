import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import api from '../../services/api'

const Dashboard = () => {
    const [data, setData] = useState({ totalCars: 0, totalBookings: 0, pendingBookings: 0, completedBookings: 0, recentBookings: [], monthlyRevenue: 0 })
    const currency = import.meta.env.VITE_CURRENCY
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [confirmAction, setConfirmAction] = useState(null)
    const [updatingId, setUpdatingId] = useState(null)

    useEffect(() => {
        api.get('/bookings/owner/dashboard')
            .then(response => setData(response.data.data))
            .catch(error => setError(error.response?.data?.message || 'Unable to load dashboard'))
            .finally(() => setLoading(false))
    }, [])

    const updateStatus = async (id, status) => {
        setUpdatingId(id)
        try {
            const response = await api.put(`/bookings/${id}/status`, { status })
            setData(prev => ({
                ...prev,
                recentBookings: prev.recentBookings.map(b => b._id === id ? response.data.data : b),
                pendingBookings: status !== 'pending' ? Math.max(0, prev.pendingBookings - 1) : prev.pendingBookings,
                completedBookings: status === 'completed' ? prev.completedBookings + 1 : prev.completedBookings,
            }))
        } catch (error) {
            setError(error.response?.data?.message || 'Unable to update booking')
        } finally {
            setUpdatingId(null)
            setConfirmAction(null)
        }
    }

    const stats = [
        { label: 'Total Cars', value: data.totalCars, icon: assets.carIconColored },
        { label: 'Total Bookings', value: data.totalBookings, icon: assets.calendar_icon_colored },
        { label: 'Pending Bookings', value: data.pendingBookings, icon: assets.cautionIconColored },
        { label: 'Completed Bookings', value: data.completedBookings, icon: assets.check_icon },
    ]

    return (
        <div className="p-6 md:p-8 max-w-6xl">
            <h1 className="text-2xl font-bold text-slate-900">
                Owner Dashboard
            </h1>

            <p className="text-sm text-slate-500 mt-1.5">
                Monitor your vehicles, bookings, and revenue from one place.
            </p>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-4">
                    {error}
                </p>
            )}

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="rounded-xl border border-slate-200 p-4 h-[84px] animate-pulse bg-slate-50" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
                    {stats.map(stat => (
                        <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                                    <img src={stat.icon} className="w-4" alt="" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mt-3">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5 mt-5">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 className="font-semibold text-sm text-slate-900">Recent Bookings</h2>
                    <p className="text-xs text-slate-400 mt-1">Latest booking requests</p>

                    <div className="mt-4">
                        {data.recentBookings.length === 0 && !loading && (
                            <p className="text-xs text-slate-400 py-6 text-center">No bookings yet</p>
                        )}
                        {data.recentBookings.map(booking => (
                            <div key={booking._id} className="flex items-center gap-3 py-3.5 border-b border-slate-100 last:border-0">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                    <img src={assets.carIconColored} className="w-3.5" alt="" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-900 truncate">{booking.car?.brand} {booking.car?.model}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {new Date(booking.pickupDate).toLocaleDateString()}
                                    </p>
                                </div>

                                <p className="text-sm font-medium text-slate-900">{currency}{booking.totalPrice}</p>
                                <StatusBadge status={booking.status} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 h-fit">
                    <h2 className="font-semibold text-sm text-slate-900">Monthly Revenue</h2>
                    <p className="text-xs text-slate-400 mt-1">Revenue for current month</p>
                    <p className="text-3xl font-bold text-primary mt-5">
                        {currency}{data.monthlyRevenue}
                    </p>
                </div>
            </div>

            {/* Confirmation Modal */}
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

export default Dashboard