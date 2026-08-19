import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const submit = async event => {
        event.preventDefault()
        setSubmitting(true)
        setError('')
        try {
            await login(form)
            navigate(location.state?.from || '/')
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to log in')
        } finally { setSubmitting(false) }
    }

    return <div className="min-h-[60vh] flex items-center justify-center px-6 py-14">
        <form onSubmit={submit} className="w-full max-w-md border border-gray-100 rounded-lg shadow-sm p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-xs text-gray-500">Log in to manage bookings and reservations.</p>
            <input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button disabled={submitting} className="w-full bg-primary disabled:bg-gray-300 text-white rounded-md py-3 text-sm">{submitting ? 'Logging in...' : 'Log in'}</button>
            <p className="text-xs text-gray-500 text-center">New here? <Link to="/signup" className="text-primary">Create an account</Link></p>
        </form>
    </div>
}

export default Login