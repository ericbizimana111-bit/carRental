import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const submit = async event => {
        event.preventDefault()
        try { setMessage((await api.post('/auth/forgot-password', { email })).data.message) } catch { setMessage('If an account matches that email, reset instructions will be sent.') }
    }
    return <div className="min-h-[60vh] flex items-center justify-center px-6 py-14"><form onSubmit={submit} className="w-full max-w-md border rounded-lg p-6 space-y-4"><h1 className="text-2xl font-semibold">Reset your password</h1><p className="text-xs text-gray-500">Enter your email and we will send reset instructions if an account exists.</p><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full border rounded-md p-3 text-sm" /><button className="w-full bg-primary text-white rounded-md py-3 text-sm">Send instructions</button>{message && <p className="text-xs text-gray-500">{message}</p>}<Link to="/login" className="block text-center text-xs text-primary">Back to login</Link></form></div>
}

export default ForgotPassword