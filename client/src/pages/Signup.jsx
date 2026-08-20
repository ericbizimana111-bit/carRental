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
        } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to create account') } finally { setSubmitting(false) }
    }

    return <AuthShell mode="signup">
        <form onSubmit={submit} className="space-y-5">
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <input required placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            <input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            <input required minLength="6" type="password" placeholder="Password (6+ characters)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border rounded-md p-3 text-sm outline-none" />
            <fieldset className="grid grid-cols-2 gap-2">
                <legend className="mb-2 text-xs font-medium text-gray-600">How will you use CarRental?</legend>
                <label className={`cursor-pointer rounded-md border p-3 text-xs ${form.role === 'user' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200'}`}><input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={e => setForm({ ...form, role: e.target.value })} className="sr-only" />Rent a car</label>
                <label className={`cursor-pointer rounded-md border p-3 text-xs ${form.role === 'owner' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200'}`}><input type="radio" name="role" value="owner" checked={form.role === 'owner'} onChange={e => setForm({ ...form, role: e.target.value })} className="sr-only" />List my car</label>
            </fieldset>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button disabled={submitting} className="w-full bg-primary disabled:bg-gray-300 text-white rounded-md py-3 text-sm">{submitting ? 'Creating account...' : 'Create account'}</button>
            <p className="text-xs text-gray-500 text-center">Already registered? <Link to="/login" className="text-primary">Log in</Link></p>
        </form>
        </form>
    </AuthShell>
}

export default Signup