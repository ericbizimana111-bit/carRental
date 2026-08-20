import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import { compressImage } from '../utils/imageUpload'

const Profile = () => {
    const { user, getCurrentUser } = useAuth()
    const [form, setForm] = useState({ name: '', phone: '', image: '' })
    const [password, setPassword] = useState({ currentPassword: '', newPassword: '' })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user) {
            setForm({ name: user.name || '', phone: user.phone || '', image: user.image || '' })
        }
    }, [user])

    const saveProfile = async event => {
        event.preventDefault()
        setSaving(true)
        setMessage('')
        setError('')
        try {
            await api.patch('/users/profile', form)
            await getCurrentUser()
            setMessage('Profile updated successfully')
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to update profile')
        } finally {
            setSaving(false)
        }
    }

    const selectProfileImage = async event => {
        const file = event.target.files?.[0]
        if (file) {
            const image = await compressImage(file)
            setForm(current => ({ ...current, image }))
        }
    }

    const savePassword = async event => {
        event.preventDefault()
        setMessage('')
        setError('')
        try {
            await api.patch('/users/password', password)
            setPassword({ currentPassword: '', newPassword: '' })
            setMessage('Password changed successfully')
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to change password')
        }
    }

    return (
        <div className="page-container !max-w-2xl">
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">Manage your personal details and account security.</p>

            {(message || error) && (
                <p className={`mt-4 rounded-lg px-4 py-3 text-sm ${error ? 'border border-red-100 bg-red-50 text-red-600' : 'border border-green-100 bg-green-50 text-green-700'}`}>
                    {error || message}
                </p>
            )}

            <form onSubmit={saveProfile} className="card mt-8 space-y-5 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Personal details</h2>

                <div className="flex flex-wrap items-center gap-5">
                    <div className="relative">
                        <img
                            src={form.image || assets.user_profile}
                            className="h-20 w-20 rounded-full border-2 border-slate-100 object-cover shadow-sm"
                            alt="Profile preview"
                        />
                    </div>
                    <label className="btn-secondary !cursor-pointer !rounded-lg !py-2.5 !text-sm">
                        Change photo
                        <input type="file" accept="image/*" onChange={selectProfileImage} className="hidden" />
                    </label>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                    <input
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone number</label>
                    <input
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="Your phone number"
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                    <input
                        value={user?.email || ''}
                        disabled
                        className="input-field cursor-not-allowed bg-slate-50 text-slate-500"
                    />
                </div>

                <button disabled={saving} className="btn-primary !rounded-lg">
                    {saving ? 'Saving...' : 'Save profile'}
                </button>
            </form>

            <form onSubmit={savePassword} className="card mt-6 space-y-5 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Change password</h2>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Current password</label>
                    <input
                        required
                        type="password"
                        value={password.currentPassword}
                        onChange={e => setPassword({ ...password, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">New password</label>
                    <input
                        required
                        minLength="6"
                        type="password"
                        value={password.newPassword}
                        onChange={e => setPassword({ ...password, newPassword: e.target.value })}
                        placeholder="Enter new password (6+ characters)"
                        className="input-field"
                    />
                </div>

                <button className="btn-secondary !rounded-lg">Change password</button>
            </form>
        </div>
    )
}

export default Profile
