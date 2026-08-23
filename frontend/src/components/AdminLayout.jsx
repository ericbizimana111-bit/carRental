import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import AdminSidebar from './AdminSidebar'

const AdminLayout = () => (
    <div className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="flex">
            <AdminSidebar />
            <main className="min-w-0 flex-1"><Outlet /></main>
        </div>
    </div>
)

export default AdminLayout