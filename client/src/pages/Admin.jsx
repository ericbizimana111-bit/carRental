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

    useEffect(() => {
        const load = async () => {
            try {
                if (section === 'overview') setStats((await api.get('/admin/stats')).data.data)
                else setItems((await api.get(`/admin/${section}`)).data.data || [])
            } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load admin data') }
        }
        load()
    }, [section])

    const links = [['overview', 'Overview'], ['users', 'Users'], ['cars', 'Cars'], ['bookings', 'Bookings']]
    return <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <h1 className="text-2xl font-semibold">Admin Console</h1>
        <nav className="flex gap-4 mt-5 border-b pb-3 text-xs">
            {links.map(([path, label]) => <Link key={path} to={path === 'overview' ? '/admin' : `/admin/${path}`} className={section === path ? 'text-primary font-medium' : 'text-gray-500'}>{label}</Link>)}
        </nav>
        {error && <p className="text-sm text-red-500 mt-6">{error}</p>}
        {section === 'overview' && stats && <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-7">{[['Users', stats.users], ['Owners', stats.owners], ['Cars', stats.cars], ['Bookings', stats.bookings], ['Revenue', `$${stats.revenue}`]].map(([label, value]) => <div key={label} className="border rounded-lg p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-semibold mt-2">{value}</p></div>)}</div>}
        {section === 'users' && <div className="mt-7 space-y-2">{items.map(user => <div key={user._id} className="border rounded-lg p-4 flex justify-between"><div><p className="text-sm">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div><StatusBadge status={user.role} /></div>)}</div>}
        {section === 'cars' && <div className="mt-7 space-y-2">{items.map(car => <div key={car._id} className="border rounded-lg p-4 flex items-center gap-4"><img src={car.image} className="w-16 h-10 object-cover rounded" alt={`${car.brand} ${car.model}`} /><div><p className="text-sm">{car.brand} {car.model}</p><p className="text-xs text-gray-500">Owner: {car.owner?.name || 'Unknown'}</p></div></div>)}</div>}
        {section === 'bookings' && <div className="mt-7 space-y-2">{items.map(booking => <div key={booking._id} className="border rounded-lg p-4 flex justify-between"><div><p className="text-sm">{booking.car?.brand} {booking.car?.model}</p><p className="text-xs text-gray-500">{booking.user?.name} · ${booking.totalPrice}</p></div><StatusBadge status={booking.status} /></div>)}</div>}
    </div>
}

export default Admin