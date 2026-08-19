import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth()
    const location = useLocation()
    if (loading) return <p className="mt-20 text-center text-gray-500">Loading session...</p>
    if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
    if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
    return children
}

export default ProtectedRoute