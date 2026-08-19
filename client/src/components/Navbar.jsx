import React, { useEffect, useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Navbar = () => {

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const { user, loading, logout } = useAuth()
    const [unreadNotifications, setUnreadNotifications] = useState(0)

    useEffect(() => {
        if (!user) {
            setUnreadNotifications(0)
            return
        }
        api.get('/notifications').then(response => setUnreadNotifications(response.data.unread || 0)).catch(() => setUnreadNotifications(0))
    }, [user])

    return (
        <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32
        py-4 text-gray-600 border-b border-borderColor relative transition-all
        ${location.pathname === "/" && "bg-light"}`}>

            <Link to='/'>
                <img src={assets.logo} alt="logo" className="h-8" />
            </Link>


            <div className={`max-sm:h-screen max-sm:fixed max-sm:w-full max-sm:top-16 max-sm:border-t
            border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 
            sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 
            ${location.pathname === "/" ? "bg-light" : "bg-white"}
            ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>

                {menuLinks.map((link, index) => (
                    <Link key={index} to={link.path} onClick={() => setOpen(false)}>
                        {link.name}
                    </Link>
                ))}

                <div className='hidden lg:flex items:center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
                    <input type="text" className="py-1.5 w-full bg-transparent 
                    outline-none  placeholder-gray-500"  placeholder='Searh Products' />
                    <img src={assets.search_icon} alt="search" />
                </div>


                <div className='flex max-sm:flex-col items:start sm:items-center gap-6'>

                    {!loading && user && user.role === 'owner' && <button onClick={() => navigate('/owner')} className='cursor-pointer'>Dashboard</button>}
                    {!loading && user && user.role === 'admin' && <button onClick={() => navigate('/admin')} className='cursor-pointer'>Admin</button>}
                    {!loading && user ? <>
                        <span className="text-sm text-gray-700">{user.name}</span>
                        {unreadNotifications > 0 && <button onClick={() => navigate('/notifications')} className="text-xs text-primary">Notifications ({unreadNotifications})</button>}
                        <button onClick={logout} className='cursor-pointer px-5 py-2 border border-borderColor rounded-lg'>Logout</button>
                    </> : <button onClick={() => navigate('/login')} className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'>Login</button>}

                </div>

            </div>

            <button className='sm:hidden cursor:pointer' arial-label="Menu" onClick={() => setOpen(!open)}>
                <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
            </button>

        </div>
    )
}

export default Navbar