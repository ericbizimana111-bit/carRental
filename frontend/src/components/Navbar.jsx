import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../services/api'

const NavLink = ({ to, children, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`text-sm font-medium transition-colors ${active ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
    >
        {children}
    </Link>
)

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const { user, loading, logout } = useAuth()
    const [unreadNotifications, setUnreadNotifications] = useState(0)

    useEffect(() => {
        if (!user) return
        api.get('/notifications')
            .then(response => setUnreadNotifications(response.data.unread || 0))
            .catch(() => setUnreadNotifications(0))
    }, [user])

    const closeMenu = () => setOpen(false)
    const isAdmin = user?.role === 'admin'
    const isOwner = user?.role === 'owner'
    const isGuest = !loading && !user

    const publicLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/#about' },
        { name: 'Contact Us', path: '/#contact' },
    ]

    const userLinks = [
        { name: 'Browse Cars', path: '/cars' },
        { name: 'My Bookings', path: '/my-bookings' },
    ]

    const ownerLinks = [
        { name: 'Browse Cars', path: '/cars' },
        { name: 'Dashboard', path: '/owner' },
        { name: 'My Cars', path: '/owner/manage-cars' },
        { name: 'Bookings', path: '/owner/manage-bookings' },
        { name: 'My Rentals', path: '/my-bookings' },
    ]

    const adminLinks = [{ name: 'Admin', path: '/admin' }]

    const centerLinks = isAdmin ? adminLinks : isOwner ? ownerLinks : user ? userLinks : publicLinks

    const isActive = path => {
        if (path.includes('#')) return location.pathname === '/' && location.hash === path.replace('/', '')
        return location.pathname === path
    }

    const handleLogout = () => {
        closeMenu()
        logout()
    }

    return (
        <header className={`relative z-20 border-b border-slate-200 ${location.pathname === '/' ? 'bg-light' : 'bg-white'}`}>
            <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                {/* Left zone — Logo */}
                <Link to="/" onClick={closeMenu} className="shrink-0">
                    <img src={assets.logo} alt="CarRental home" className="h-8" />
                </Link>

                {/* Center zone — nav links */}
                <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
                    {centerLinks.map(link => (
                        <NavLink key={link.path} to={link.path} active={isActive(link.path)} onClick={closeMenu}>
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Right zone — profile + login/logout + hamburger */}
                <div className="flex items-center gap-3">
                    {isOwner && user && (
                        <Link to="/profile" onClick={closeMenu} className="hidden sm:block" title="View profile">
                            <img
                                src={user.image || assets.user_profile}
                                alt={`${user.name}'s profile`}
                                className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm ring-2 ring-slate-100 transition hover:ring-primary/30"
                            />
                        </Link>
                    )}
                    {!isOwner && user && !isAdmin && (
                        <Link to="/profile" onClick={closeMenu} className="hidden items-center gap-2 sm:flex" title="View profile">
                            <img
                                src={user.image || assets.user_profile}
                                alt=""
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
                            />
                        </Link>
                    )}
                    {isGuest && (
                        <button
                            type="button"
                            onClick={() => { closeMenu(); navigate('/login') }}
                            className="hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dull sm:inline-flex"
                        >
                            Login
                        </button>
                    )}
                    {!loading && user && (
                        <>
                            {unreadNotifications > 0 && (
                                <Link
                                    to="/notifications"
                                    onClick={closeMenu}
                                    className="hidden text-sm font-medium text-primary sm:inline-flex"
                                >
                                    Notifications ({unreadNotifications})
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="hidden rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary/30 hover:text-primary sm:inline-flex"
                            >
                                Logout
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        aria-label={open ? 'Close navigation' : 'Open navigation'}
                        onClick={() => setOpen(!open)}
                        className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
                    >
                        <img src={open ? assets.close_icon : assets.menu_icon} alt="" className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg lg:hidden">
                    <nav className="flex flex-col gap-4">
                        {centerLinks.map(link => (
                            <NavLink key={link.path} to={link.path} active={isActive(link.path)} onClick={closeMenu}>
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5">
                        {isGuest ? (
                            <button
                                type="button"
                                onClick={() => { closeMenu(); navigate('/login') }}
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
                            >
                                Login
                            </button>
                        ) : (
                            <>
                                {isOwner && (
                                    <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 text-sm text-slate-700">
                                        <img src={user.image || assets.user_profile} alt="" className="h-10 w-10 rounded-full object-cover" />
                                        {user.name}
                                    </Link>
                                )}
                                {unreadNotifications > 0 && (
                                    <Link to="/notifications" onClick={closeMenu} className="text-sm text-primary">
                                        Notifications ({unreadNotifications})
                                    </Link>
                                )}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
