import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AuthShell from '../components/AuthShell'

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
            const account = await login(form)
            navigate(location.state?.from || (account.role === 'admin' ? '/admin' : account.role === 'owner' ? '/owner' : '/'))
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to log in')
        } finally { setSubmitting(false) }
    }

    return <AuthShell mode="signin">
        <form onSubmit={submit} className="space-y-5">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-xs text-gray-500">Log in to manage bookings and reservations.</p>
            <input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button disabled={submitting} className="w-full bg-primary disabled:bg-gray-300 text-white rounded-md py-3 text-sm">{submitting ? 'Logging in...' : 'Log in'}</button>
            <p className="text-xs text-gray-500 text-center">New here? <Link to="/signup" state={{ from: location.state?.from }} className="text-primary">Create an account</Link></p>
            <Link to="/forgot-password" className="block text-center text-xs text-primary">Forgot password?</Link>
        </form>
    </AuthShell>
}

export default Login