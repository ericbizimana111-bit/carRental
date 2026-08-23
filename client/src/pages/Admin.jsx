import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import ConfirmModal from '../components/ConfirmModal'
import api from '../services/api'

const Admin = () => {
    const location = useLocation()
    const section = location.pathname.split('/')[2] || 'overview'
    const [stats, setStats] = useState(null)
    const [items, setItems] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)
    const [roles, setRoles] = useState({})
    const [bookingSearch, setBookingSearch] = useState('')
    const [ownerFilter, setOwnerFilter] = useState('')
    const [ownerOptions, setOwnerOptions] = useState([])
    const [confirmAction, setConfirmAction] = useState(null)

    useEffect(() => {
        if (section === 'bookings') {
            api.get('/admin/users')
                .then(response => setOwnerOptions((response.data.data || []).filter(user => user.role === 'owner')))
                .catch(() => setOwnerOptions([]))
        }
    }, [section])

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                if (section === 'overview') {
                    setStats((await api.get('/admin/stats')).data.data)
                } else if (section === 'bookings') {
                    const params = ownerFilter ? { owner: ownerFilter } : {}
                    setItems((await api.get('/admin/bookings', { params })).data.data || [])
                } else if (section === 'pending') {
                    setItems((await api.get('/admin/cars/pending')).data.data || [])
                } else {
                    setItems((await api.get(`/admin/${section}`)).data.data || [])
                }
            } catch (requestError) {
                setError(requestError.response?.data?.message || 'Unable to load admin data')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [section, ownerFilter])

    const filteredBookings = useMemo(() => {
        const query = bookingSearch.toLowerCase()
        if (!query) return items
        return items.filter(booking =>
            [booking.owner?.name, booking.user?.name, booking.car?.brand, booking.car?.model]
                .some(value => value?.toLowerCase().includes(query))
        )
    }, [items, bookingSearch])

    const updateBookingStatus = async (id, status) => {
        setUpdatingId(id)
        setError('')
        try {
            const response = await api.put(`/bookings/${id}/status`, { status })
            setItems(current => current.map(booking => booking._id === id ? response.data.data : booking))
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to update booking')
        } finally {
            setUpdatingId(null)
        }
    }

    const approveCar = async id => {
        setUpdatingId(id)
        setError('')
        try {
            await api.put(`/admin/cars/${id}/approve`)
            setItems(current => current.filter(car => car._id !== id))
            if (stats) setStats(prev => ({ ...prev, pendingListings: Math.max((prev.pendingListings || 1) - 1, 0) }))
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to approve car')
        } finally {
            setUpdatingId(null)
            setConfirmAction(null)
        }
    }

    const rejectCar = async id => {
        setUpdatingId(id)
        setError('')
        try {
            await api.put(`/admin/cars/${id}/reject`, { reason: 'Does not meet listing standards' })
            setItems(current => current.filter(car => car._id !== id))
            if (stats) setStats(prev => ({ ...prev, pendingListings: Math.max((prev.pendingListings || 1) - 1, 0) }))
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to reject car')
        } finally {
            setUpdatingId(null)
            setConfirmAction(null)
        }
    }

    const updateUserRole = async id => {
        setUpdatingId(id)
        setError('')
        try {
            const response = await api.patch(`/admin/users/${id}/role`, { role: roles[id] })
            setItems(current => current.map(user => user._id === id ? response.data.data : user))
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to update user role')
        } finally {
            setUpdatingId(null)
        }
    }

    const currency = import.meta.env.VITE_CURRENCY || '$'

    return (
        <div className="min-h-[calc(100vh-73px)] px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Control center</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Admin Console</h1>
                        <p className="mt-1 text-sm text-slate-500">Monitor the marketplace and keep daily operations moving.</p>
                    </div>
                    <Link to="/" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary/30 hover:text-primary">
                        View marketplace
                    </Link>
                </div>

                {error && <p className="mt-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
                {loading && <p className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading {section}...</p>}

                {/* OVERVIEW */}
                {!loading && section === 'overview' && stats && (
                    <div className="mt-8 space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
                            {[
                                ['Users', stats.users],
                                ['Owners', stats.owners],
                                ['Cars', stats.cars],
                                ['Bookings', stats.bookings],
                                ['Pending Listings', stats.pendingListings || 0],
                            ].map(([label, value]) => (
                                <div key={label} className="card p-5">
                                    <p className="text-sm font-medium text-slate-500">{label}</p>
                                    <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Revenue Section */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="card p-5 border-l-4 border-l-blue-500">
                                <p className="text-sm font-medium text-slate-500">Total Platform Revenue</p>
                                <p className="mt-3 text-2xl font-semibold text-blue-600">{currency}{stats.totalRevenue?.toLocaleString() || 0}</p>
                                <p className="mt-1 text-xs text-slate-400">From {stats.completedBookings || 0} completed bookings</p>
                            </div>
                            <div className="card p-5 border-l-4 border-l-green-500">
                                <p className="text-sm font-medium text-slate-500">Platform Fee (5%)</p>
                                <p className="mt-3 text-2xl font-semibold text-green-600">{currency}{stats.platformRevenue?.toLocaleString() || 0}</p>
                                <p className="mt-1 text-xs text-slate-400">Earned by CarRental</p>
                            </div>
                            <div className="card p-5 border-l-4 border-l-purple-500">
                                <p className="text-sm font-medium text-slate-500">Owner Earnings (95%)</p>
                                <p className="mt-3 text-2xl font-semibold text-purple-600">{currency}{stats.ownerEarnings?.toLocaleString() || 0}</p>
                                <p className="mt-1 text-xs text-slate-400">Paid out to car owners</p>
                            </div>
                        </div>

                        {/* Car Distribution Chart */}
                        {stats.carDistribution && stats.carDistribution.length > 0 && (
                            <div className="card p-6">
                                <h3 className="text-sm font-semibold text-slate-900">Car Distribution by Owner</h3>
                                <p className="mt-1 text-xs text-slate-400">Number of listed cars per owner</p>
                                <div className="mt-5 space-y-3">
                                    {stats.carDistribution.map(item => {
                                        const maxCount = Math.max(...stats.carDistribution.map(d => d.count))
                                        const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                                        return (
                                            <div key={item._id} className="flex items-center gap-3">
                                                <span className="w-32 truncate text-sm text-slate-600">{item.ownerName || 'Unknown'}</span>
                                                <div className="flex-1">
                                                    <div className="h-6 rounded-full bg-slate-100">
                                                        <div
                                                            className="h-6 rounded-full bg-primary transition-all duration-500"
                                                            style={{ width: `${Math.max(percentage, 5)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="w-8 text-right text-sm font-medium text-slate-900">{item.count}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Revenue Per Owner */}
                        {stats.revenuePerOwner && stats.revenuePerOwner.length > 0 && (
                            <div className="card overflow-hidden">
                                <div className="border-b border-slate-100 px-6 py-4">
                                    <h3 className="text-sm font-semibold text-slate-900">Revenue Breakdown by Owner</h3>
                                    <p className="mt-1 text-xs text-slate-400">Platform takes 5%, owners keep 95%</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50">
                                                <th className="px-6 py-3 font-medium text-slate-500">Owner</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Bookings</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Total Revenue</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Owner Earnings (95%)</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Platform Fee (5%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.revenuePerOwner.map(item => (
                                                <tr key={item._id} className="border-b border-slate-50">
                                                    <td className="px-6 py-3 font-medium text-slate-900">{item.ownerName || 'Unknown'}</td>
                                                    <td className="px-6 py-3 text-slate-600">{item.totalBookings}</td>
                                                    <td className="px-6 py-3 font-medium text-slate-900">{currency}{item.totalRevenue?.toLocaleString()}</td>
                                                    <td className="px-6 py-3 text-green-600 font-medium">{currency}{item.ownerEarnings?.toLocaleString()}</td>
                                                    <td className="px-6 py-3 text-blue-600 font-medium">{currency}{item.platformFee?.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* USERS */}
                {!loading && section === 'users' && (
                    <div className="mt-8 space-y-3">
                        {items.length === 0 ? (
                            <p className="card p-6 text-sm text-slate-500">No users found.</p>
                        ) : items.map(user => (
                            <div key={user._id} data-testid="admin-user-row" className="card flex flex-wrap items-center justify-between gap-4 p-5">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={user.role} />
                                    <select aria-label={`Role for ${user.name}`} value={roles[user._id] || user.role} onChange={event => setRoles(current => ({ ...current, [user._id]: event.target.value }))} className="input-field !w-auto !py-1.5">
                                        <option value="user">Customer</option>
                                        <option value="owner">Owner</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button disabled={updatingId === user._id || !roles[user._id] || roles[user._id] === user.role} onClick={() => updateUserRole(user._id)} className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white disabled:bg-slate-200 disabled:text-slate-400">
                                        Save role
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PENDING LISTINGS */}
                {!loading && section === 'pending' && (
                    <div className="mt-8 space-y-3">
                        {items.length === 0 ? (
                            <div className="card p-10 text-center">
                                <p className="text-sm text-slate-500">No pending listings to review.</p>
                            </div>
                        ) : items.map(car => (
                            <div key={car._id} className="card p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src={car.image} className="h-16 w-24 rounded-lg object-cover" alt={`${car.brand} ${car.model}`} />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{car.brand} {car.model}</p>
                                            <p className="mt-1 text-sm text-slate-500">Owner: {car.owner?.name || 'Unknown'}</p>
                                            <p className="mt-0.5 text-sm text-slate-500">{car.year} · {car.category} · {car.location}</p>
                                            <p className="mt-0.5 text-sm font-medium text-primary">{currency}{car.pricePerDay}/day</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={updatingId === car._id}
                                            onClick={() => setConfirmAction({ type: 'approve', id: car._id, car: `${car.brand} ${car.model}` })}
                                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dull disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            disabled={updatingId === car._id}
                                            onClick={() => setConfirmAction({ type: 'reject', id: car._id, car: `${car.brand} ${car.model}` })}
                                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CARS */}
                {!loading && section === 'cars' && (
                    <div className="mt-8 space-y-3">
                        {items.length === 0 ? (
                            <p className="card p-6 text-sm text-slate-500">No cars found.</p>
                        ) : items.map(car => (
                            <div key={car._id} className="card flex items-center gap-4 p-4">
                                <img src={car.image} className="h-14 w-24 rounded-lg object-cover" alt={`${car.brand} ${car.model}`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{car.brand} {car.model}</p>
                                    <p className="mt-1 text-sm text-slate-500">Owner: {car.owner?.name || 'Unknown'}</p>
                                </div>
                                <StatusBadge status={car.listingStatus || 'pending'} />
                            </div>
                        ))}
                    </div>
                )}

                {/* BOOKINGS */}
                {!loading && section === 'bookings' && (
                    <div className="mt-8">
                        <div className="mb-4 flex flex-wrap gap-3">
                            <select
                                value={ownerFilter}
                                onChange={event => setOwnerFilter(event.target.value)}
                                className="input-field min-w-[200px] !w-auto"
                                aria-label="Filter by car owner"
                            >
                                <option value="">All owners</option>
                                {ownerOptions.map(owner => (
                                    <option key={owner._id} value={owner._id}>{owner.name}</option>
                                ))}
                            </select>
                            <input
                                value={bookingSearch}
                                onChange={event => setBookingSearch(event.target.value)}
                                placeholder="Search customer or car"
                                className="input-field min-w-64 flex-1"
                            />
                        </div>

                        <div className="space-y-3">
                            {filteredBookings.length === 0 ? (
                                <p className="card p-6 text-sm text-slate-500">No bookings match your filters.</p>
                            ) : filteredBookings.map(booking => (
                                <div key={booking._id} className="card p-5">
                                    <div className="flex flex-wrap justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{booking.car?.brand} {booking.car?.model || 'Unavailable car'}</p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Renter: {booking.user?.name || 'Unknown'} · Owner: {booking.owner?.name || 'Unknown'}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()} · {currency}{booking.totalPrice}
                                            </p>
                                        </div>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {booking.status === 'pending' && (
                                            <button disabled={updatingId === booking._id} onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white disabled:opacity-50">
                                                Confirm
                                            </button>
                                        )}
                                        {['pending', 'confirmed'].includes(booking.status) && (
                                            <button disabled={updatingId === booking._id} onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 disabled:opacity-50">
                                                Cancel
                                            </button>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <button disabled={updatingId === booking._id} onClick={() => updateBookingStatus(booking._id, 'completed')} className="rounded-lg border border-green-200 px-3 py-1.5 text-sm text-green-600 disabled:opacity-50">
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal for Approve/Reject */}
            {confirmAction && (
                <ConfirmModal
                    open={true}
                    title={confirmAction.type === 'approve' ? `Approve ${confirmAction.car}?` : `Reject ${confirmAction.car}?`}
                    message={confirmAction.type === 'approve'
                        ? 'This listing will become visible to renters on the platform.'
                        : 'This listing will not go live. The owner will be notified.'}
                    confirmLabel={confirmAction.type === 'approve' ? 'Approve listing' : 'Reject listing'}
                    onConfirm={() => confirmAction.type === 'approve' ? approveCar(confirmAction.id) : rejectCar(confirmAction.id)}
                    onCancel={() => setConfirmAction(null)}
                    busy={Boolean(updatingId)}
                />
            )}
        </div>
    )
}

export default Admin
