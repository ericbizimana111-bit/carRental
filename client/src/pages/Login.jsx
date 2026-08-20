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
            setError(requestError.response?.data?.message || 'Unable to sign in')
        } finally { setSubmitting(false) }
    }

    return (
        <AuthShell mode="signin">
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Sign In</h1>
                    <p className="mt-1 text-sm text-slate-500">Welcome back — access your rentals and reservations.</p>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
                    <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                    <input
                        required
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="input-field"
                    />
                </div>

                <Link to="/forgot-password" className="block text-sm font-medium text-primary hover:underline">
                    Forgot your password?
                </Link>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button disabled={submitting} className="btn-primary w-full !rounded-lg">
                    {submitting ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-slate-500">
                    New to CarRental?{' '}
                    <Link to="/signup" state={{ from: location.state?.from }} className="font-medium text-primary hover:underline">
                        Create an account
                    </Link>
                </p>
            </form>
        </AuthShell>
    )
}

export default Login
