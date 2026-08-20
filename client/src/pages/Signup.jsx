import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AuthShell from '../components/AuthShell'

const Signup = () => {
    const { register } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const submit = async event => {
        event.preventDefault()
        setSubmitting(true)
        setError('')
        try {
            const account = await register(form)
            navigate(location.state?.from || (account.role === 'owner' ? '/owner' : '/'))
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to create account')
        } finally { setSubmitting(false) }
    }

    return (
        <AuthShell mode="signup">
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Create Account</h1>
                    <p className="mt-1 text-sm text-slate-500">Join CarRental to rent premium vehicles or list your own.</p>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                    <input
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="input-field"
                    />
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
                        minLength="6"
                        type="password"
                        placeholder="At least 6 characters"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="input-field"
                    />
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium text-slate-700">I want to</p>
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: 'user' })}
                            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${form.role === 'user' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                        >
                            Rent a Car
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: 'owner' })}
                            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${form.role === 'owner' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                        >
                            List My Car
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        {form.role === 'user'
                            ? 'Browse and book vehicles from trusted owners across the platform.'
                            : 'List your vehicle and manage bookings from your owner dashboard.'}
                    </p>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button disabled={submitting} className="btn-primary w-full !rounded-lg">
                    {submitting ? 'Creating account...' : 'Sign Up'}
                </button>

                <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthShell>
    )
}

export default Signup
