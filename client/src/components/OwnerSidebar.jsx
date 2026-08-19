import React from 'react'
import { ownerMenuLinks } from '../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const OwnerSidebar = () => {
    const location = useLocation()
    const { user } = useAuth()

    return (
        <aside className="w-52 shrink-0 border-r border-gray-200 min-h-[calc(100vh-65px)]">
            <div className="flex flex-col items-center py-6 border-b border-gray-100">
                <img
                    src={user?.image || ''}
                    className="w-11 h-11 rounded-full object-cover"
                    alt=""
                />
                <p className="text-xs font-medium mt-2">
                    {user?.name || 'Owner'}
                </p>
            </div>

            <nav className="mt-3">
                {ownerMenuLinks.map(link => {
                    const active = location.pathname === link.path

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative flex items-center gap-3 px-5 py-3 text-xs transition-colors ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <img
                                src={active ? link.coloredIcon : link.icon}
                                className="w-4 h-4"
                                alt=""
                            />
                            {link.name}
                            {active && (
                                <span className="absolute right-0 top-0 h-full w-1 bg-blue-600 rounded-l" />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

export default OwnerSidebar