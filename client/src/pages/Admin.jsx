import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
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

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                if (section === 'overview') setStats((await api.get('/admin/stats')).data.data)
                else setItems((await api.get(`/admin/${section}`)).data.data || [])
            } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load admin data') }
            finally { setLoading(false) }
        }
        load()
    }, [section])

    const updateBookingStatus = async (id, status) => {
        setUpdatingId(id)
        setError('')
        try {
            const response = await api.put(`/bookings/${id}/status`, { status })
            setItems(current => current.map(booking => booking._id === id ? response.data.data : booking))
        } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update booking') }
        finally { setUpdatingId(null) }
    }

    const updateUserRole = async id => {
        setUpdatingId(id)
        setError('')
        try {
            const response = await api.patch(`/admin/users/${id}/role`, { role: roles[id] })
            setItems(current => current.map(user => user._id === id ? response.data.data : user))
        } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update user role') }
        finally { setUpdatingId(null) }
    }

    return <div className="min-h-[calc(100vh-73px)] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Control center</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Admin Console</h1><p className="mt-1 text-sm text-slate-500">Monitor the marketplace and keep daily operations moving.</p></div>
                <Link to="/" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600">View marketplace</Link>
            </div>
            {error && <p className="mt-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            {loading && <p className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading {section}...</p>}
            {!loading && section === 'overview' && stats && <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-5">{[['Users', stats.users], ['Owners', stats.owners], ['Cars', stats.cars], ['Bookings', stats.bookings], ['Revenue', `$${stats.revenue}`]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p></div>)}</div>}
            {!loading && section === 'users' && <div className="mt-8 space-y-3">{items.length === 0 ? <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No users found.</p> : items.map(user => <div key={user._id} data-testid="admin-user-row" className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="text-sm font-medium text-slate-900">{user.name}</p><p className="mt-1 text-xs text-slate-500">{user.email}</p></div><div className="flex items-center gap-2"><StatusBadge status={user.role} /><select aria-label={`Role for ${user.name}`} value={roles[user._id] || user.role} onChange={event => setRoles(current => ({ ...current, [user._id]: event.target.value }))} className="rounded-md border border-slate-200 px-2 py-1 text-xs"><option value="user">Customer</option><option value="owner">Owner</option><option value="admin">Admin</option></select><button disabled={updatingId === user._id || !roles[user._id] || roles[user._id] === user.role} onClick={() => updateUserRole(user._id)} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white disabled:bg-slate-200 disabled:text-slate-400">Save role</button></div></div>)}</div>}
            {!loading && section === 'cars' && <div className="mt-8 space-y-3">{items.length === 0 ? <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No cars found.</p> : items.map(car => <div key={car._id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><img src={car.image} className="h-12 w-20 rounded-lg object-cover" alt={`${car.brand} ${car.model}`} /><div><p className="text-sm font-medium text-slate-900">{car.brand} {car.model}</p><p className="mt-1 text-xs text-slate-500">Owner: {car.owner?.name || 'Unknown'}</p></div></div>)}</div>}
            {!loading && section === 'bookings' && <div className="mt-8 space-y-3">{items.length === 0 ? <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No bookings found.</p> : items.map(booking => <div key={booking._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-sm font-medium text-slate-900">{booking.car?.brand} {booking.car?.model || 'Unavailable car'}</p><p className="mt-1 text-xs text-slate-500">Customer: {booking.user?.name || 'Unknown'} · Owner: {booking.owner?.name || 'Unknown'}</p><p className="mt-1 text-xs text-slate-500">{new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()} · ${booking.totalPrice} · {booking.paymentStatus || 'unpaid'}</p></div><StatusBadge status={booking.status} /></div><div className="mt-4 flex flex-wrap gap-2">{booking.status === 'pending' && <button disabled={updatingId === booking._id} onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="rounded-md border border-blue-200 px-3 py-1.5 text-xs text-blue-600 disabled:opacity-50">Confirm</button>}{['pending', 'confirmed'].includes(booking.status) && <button disabled={updatingId === booking._id} onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 disabled:opacity-50">Cancel</button>}{booking.status === 'confirmed' && <button disabled={updatingId === booking._id} onClick={() => updateBookingStatus(booking._id, 'completed')} className="rounded-md border border-green-200 px-3 py-1.5 text-xs text-green-600 disabled:opacity-50">Complete</button>}</div></div>)}</div>}
        </div>
    </div>
}

export default Admin