import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const submit = async event => {
        event.preventDefault()
        try { setMessage((await api.post(`/auth/reset-password/${token}`, { password })).data.message); setTimeout(() => navigate('/login'), 800) } catch (error) { setMessage(error.response?.data?.message || 'Unable to reset password') }
    }
    return <div className="min-h-[60vh] flex items-center justify-center px-6 py-14"><form onSubmit={submit} className="w-full max-w-md border rounded-lg p-6 space-y-4"><h1 className="text-2xl font-semibold">Choose a new password</h1><input required minLength="6" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" className="w-full border rounded-md p-3 text-sm" /><button className="w-full bg-primary text-white rounded-md py-3 text-sm">Reset password</button>{message && <p className="text-xs text-gray-500">{message}</p>}<Link to="/login" className="block text-center text-xs text-primary">Back to login</Link></form></div>
}

export default ResetPassword