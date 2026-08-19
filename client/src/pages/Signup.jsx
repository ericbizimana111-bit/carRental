import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const submit = async event => {
        event.preventDefault()
        setSubmitting(true)
        setError('')
        try { await register(form); navigate('/') } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to create account') } finally { setSubmitting(false) }
    }

    return <div className="min-h-[60vh] flex items-center justify-center px-6 py-14">
        <form onSubmit={submit} className="w-full max-w-md border border-gray-100 rounded-lg shadow-sm p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <input required placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            <input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            <input required minLength="6" type="password" placeholder="Password (6+ characters)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button disabled={submitting} className="w-full bg-primary disabled:bg-gray-300 text-white rounded-md py-3 text-sm">{submitting ? 'Creating account...' : 'Create account'}</button>
            <p className="text-xs text-gray-500 text-center">Already registered? <Link to="/login" className="text-primary">Log in</Link></p>
        </form>
    </div>
}

export default Signup