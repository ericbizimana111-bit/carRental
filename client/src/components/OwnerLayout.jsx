import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import OwnerSidebar from './OwnerSidebar'

const OwnerLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex">
                <OwnerSidebar />
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default OwnerLayout