import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../services/api'

const Navbar = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const { user, loading, logout } = useAuth()
    const [unreadNotifications, setUnreadNotifications] = useState(0)

    useEffect(() => {
        if (!user) return
        api.get('/notifications').then(response => setUnreadNotifications(response.data.unread || 0)).catch(() => setUnreadNotifications(0))
    }, [user])

    const closeMenu = () => setOpen(false)
    const isAdmin = user?.role === 'admin'
    const isOwner = user?.role === 'owner'
    const links = isAdmin
        ? [{ name: 'Admin', path: '/admin' }]
        : isOwner
            ? [{ name: 'Browse cars', path: '/cars' }, { name: 'Dashboard', path: '/owner' }, { name: 'My cars', path: '/owner/manage-cars' }, { name: 'Bookings', path: '/owner/manage-bookings' }]
            : user ? [{ name: 'Browse cars', path: '/cars' }, { name: 'My bookings', path: '/my-bookings' }] : [{ name: 'Home', path: '/' }, { name: 'About Us', path: '/#about' }, { name: 'Contact Us', path: '/#contact' }, { name: 'Browse Cars', path: '/cars' }]

    return <header className={`relative z-20 border-b border-slate-200 ${location.pathname === '/' ? 'bg-[#f1f5f9]' : 'bg-white'}`}>
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
            <Link to="/" onClick={closeMenu} className="shrink-0"><img src={assets.logo} alt="CarRental home" className="h-8" /></Link>
            <button type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)} className="rounded-md p-2 sm:hidden"><img src={open ? assets.close_icon : assets.menu_icon} alt="" className="h-5 w-5" /></button>
            <div className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-5 border-b border-slate-200 bg-white p-5 shadow-lg sm:static sm:flex sm:flex-row sm:items-center sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none`}>
                <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
                    {links.map(link => <Link key={link.path} to={link.path} onClick={closeMenu} className={`text-sm transition-colors ${location.pathname === link.path ? 'font-medium text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>{link.name}</Link>)}
                    {!user && <Link to="/owner/add-car" onClick={closeMenu} className="text-sm text-slate-600 transition-colors hover:text-blue-600">List Your Car</Link>}
                </nav>
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:border-0 sm:pt-0">
                    {!loading && user ? <>
                        {unreadNotifications > 0 && <Link to="/notifications" onClick={closeMenu} className="text-sm text-blue-600">Notifications ({unreadNotifications})</Link>}
                        <Link to="/profile" onClick={closeMenu} className="text-sm text-slate-700">{user.name}</Link>
                        <button type="button" onClick={() => { closeMenu(); logout() }} className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600">Logout</button>
                    </> : <button type="button" onClick={() => { closeMenu(); navigate('/login') }} className="rounded-md bg-blue-600 px-5 py-2 text-center text-sm text-white transition-colors hover:bg-blue-700">Login</button>}
                </div>
            </div>
        </div>
    </header>
}

export default Navbar

