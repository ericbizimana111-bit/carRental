import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const getCurrentUser = async () => {
        try {
            const response = await api.get('/auth/me')
            setUser(response.data.user)
            return response.data.user
        } catch {
            setUser(null)
            return null
        } finally { setLoading(false) }
    }

    useEffect(() => { getCurrentUser() }, [])

    const login = async credentials => {
        const response = await api.post('/auth/login', credentials)
        setUser(response.data.user)
        return response.data.user
    }

    const register = async details => {
        const response = await api.post('/auth/register', details)
        setUser(response.data.user)
        return response.data.user
    }

    const logout = async () => {
        await api.post('/auth/logout')
        setUser(null)
    }

    return <AuthContext.Provider value={{ user, loading, register, login, logout, getCurrentUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)