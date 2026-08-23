import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const navigationGroups = [
    { label: 'Workspace', links: [
        { name: 'Overview', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
    ]},
    { label: 'Management', links: [
        { name: 'Pending Listings', path: '/admin/pending', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'All Cars', path: '/admin/cars', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0l2-2m-2 2l2 2m-6-4h6' },
        { name: 'Users', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Bookings', path: '/admin/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    ]},
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
                {navigationGroups.map(group => (
                    <div key={group.label}>
                        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 max-lg:hidden">{group.label}</p>
                        <div className="space-y-1">
                            {group.links.map(link => {
                                const active = location.pathname === link.path
                                return (
                                    <Link key={link.path} to={link.path} title={link.name} className={`relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors max-lg:justify-center max-lg:px-2 ${active ? 'bg-blue-600 font-medium text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}>
                                        <svg className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                                        </svg>
                                        <span className="max-lg:hidden">{link.name}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>
            <div className="mx-3 mt-auto rounded-xl border border-blue-100 bg-blue-50 p-4 max-lg:hidden">
                <p className="text-xs font-semibold text-blue-900">Platform control</p>
                <p className="mt-1 text-[11px] leading-4 text-blue-700">Keep users, fleet, and bookings running smoothly.</p>
            </div>
        </aside>
    )
}

export default AdminSidebar
