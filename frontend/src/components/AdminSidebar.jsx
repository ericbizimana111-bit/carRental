import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAuth } from '../context/useAuth'

const navigationGroups = [
    { label: 'Workspace', links: [{ name: 'Overview', path: '/admin', icon: assets.dashboardIcon }] },
    {
        label: 'Management', links: [
            { name: 'Users', path: '/admin/users', icon: assets.users_icon },
            { name: 'Cars', path: '/admin/cars', icon: assets.carIcon },
            { name: 'Bookings', path: '/admin/bookings', icon: assets.listIcon },
        ]
    },
]

const AdminSidebar = () => {
    const location = useLocation()
    const { user } = useAuth()

    return (
        <aside className="w-64 shrink-0 border-r border-slate-200 bg-slate-50/70 min-h-[calc(100vh-73px)] max-lg:w-20">
            <div className="border-b border-slate-200 bg-white px-5 py-6 max-lg:px-3">
                <div className="flex items-center gap-3 max-lg:justify-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white">{(user?.name || 'A').charAt(0).toUpperCase()}</div>
                    <div className="min-w-0 max-lg:hidden">
                        <p className="truncate text-sm font-semibold text-slate-900">{user?.name || 'Administrator'}</p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-500">Admin account</p>
                    </div>
                </div>
            </div>
            <nav className="space-y-6 px-3 py-6" aria-label="Admin navigation">
                {navigationGroups.map(group => <div key={group.label}>
                    <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 max-lg:hidden">{group.label}</p>
                    <div className="space-y-1">
                        {group.links.map(link => {
                            const active = location.pathname === link.path
                            return <Link key={link.path} to={link.path} title={link.name} className={`relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors max-lg:justify-center max-lg:px-2 ${active ? 'bg-blue-600 font-medium text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}>
                                <img src={link.icon} className={`h-4 w-4 shrink-0 ${active ? 'brightness-0 invert' : ''}`} alt="" />
                                <span className="max-lg:hidden">{link.name}</span>
                            </Link>
                        })}
                    </div>
                </div>)}
            </nav>
            <div className="mx-3 mt-auto rounded-xl border border-blue-100 bg-blue-50 p-4 max-lg:hidden">
                <p className="text-xs font-semibold text-blue-900">Platform control</p>
                <p className="mt-1 text-[11px] leading-4 text-blue-700">Keep users, fleet, and bookings running smoothly.</p>
            </div>
        </aside>
    )
}

export default AdminSidebar