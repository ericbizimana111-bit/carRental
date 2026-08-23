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

    useEffect(() => {
        setOpen(false)
    }, [location.pathname])

    const isAdmin = user?.role === 'admin'
    const isOwner = user?.role === 'owner'
    const isGuest = !loading && !user
    const isRenter = user && !isAdmin && !isOwner

    const publicLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
    ]

    const userLinks = [
        { name: 'Home', path: '/' },
        { name: 'Browse Cars', path: '/cars' },
        { name: 'My Bookings', path: '/my-bookings' },
    ]

    const ownerLinks = [
        { name: 'Home', path: '/' },
        { name: 'Browse Cars', path: '/cars' },
        { name: 'Dashboard', path: '/owner' },
        { name: 'My Cars', path: '/owner/manage-cars' },
        { name: 'Bookings', path: '/owner/manage-bookings' },
    ]

    const adminLinks = [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/admin' },
        { name: 'Listings', path: '/admin/cars' },
        { name: 'Bookings', path: '/admin/bookings' },
    ]

    const centerLinks = isAdmin ? adminLinks : isOwner ? ownerLinks : isRenter ? userLinks : publicLinks

    const isActive = path => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    const handleLogout = () => {
        setOpen(false)
        logout()
        navigate('/')
    }

    const handleProfileClick = () => {
        setOpen(false)
        navigate('/profile')
    }

    return (
        <header className={`relative z-20 border-b border-slate-200 ${location.pathname === '/' ? 'bg-light' : 'bg-white'}`}>
            <div className="mx-auto grid min-h-[72px] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8 lg:px-10">
                {/* Left — Logo */}
                <Link to="/" onClick={() => setOpen(false)} className="shrink-0">
                    <img src={assets.logo} alt="CarRental home" className="h-8" />
                </Link>

                {/* Center — Nav links */}
                <nav className="hidden items-center justify-center gap-6 lg:flex">
                    {centerLinks.map(link => (
                        <NavLink key={link.path} to={link.path} active={isActive(link.path)} onClick={() => setOpen(false)}>
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Right — Account controls */}
                <div className="flex items-center justify-end gap-3">
                    {isGuest && (
                        <button
                            type="button"
                            onClick={() => { setOpen(false); navigate('/login') }}
                            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dull"
                        >
                            Login
                        </button>
                    )}

                    {!loading && user && (
                        <>
                            {unreadNotifications > 0 && (
                                <Link
                                    to="/notifications"
                                    onClick={() => setOpen(false)}
                                    className="hidden text-xs font-medium text-primary sm:inline-flex"
                                >
                                    Notifications ({unreadNotifications})
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={handleProfileClick}
                                className="hidden sm:block"
                                title="View profile"
                            >
                                <img
                                    src={user.image || assets.user_profile}
                                    alt={`${user.name}'s profile`}
                                    className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm ring-2 ring-slate-100 transition hover:ring-primary/30"
                                />
                            </button>
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

            {open && (
                <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg lg:hidden">
                    <nav className="flex flex-col gap-4">
                        {centerLinks.map(link => (
                            <NavLink key={link.path} to={link.path} active={isActive(link.path)} onClick={() => setOpen(false)}>
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5">
                        {isGuest ? (
                            <button
                                type="button"
                                onClick={() => { setOpen(false); navigate('/login') }}
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
                            >
                                Login
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handleProfileClick}
                                    className="flex items-center gap-3 text-sm text-slate-700"
                                >
                                    <img src={user.image || assets.user_profile} alt="" className="h-10 w-10 rounded-full object-cover" />
                                    {user.name}
                                </button>
                                {unreadNotifications > 0 && (
                                    <Link to="/notifications" onClick={() => setOpen(false)} className="text-sm text-primary">
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
