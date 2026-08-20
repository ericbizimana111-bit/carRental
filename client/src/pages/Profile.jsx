import React, { useState } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import { compressImage } from '../utils/imageUpload'

const Profile = () => {
    const { user, getCurrentUser } = useAuth()
    const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', image: user?.image || '' })
    const [password, setPassword] = useState({ currentPassword: '', newPassword: '' })
    const [message, setMessage] = useState('')
    const saveProfile = async event => { event.preventDefault(); try { await api.patch('/users/profile', form); await getCurrentUser(); setMessage('Profile updated successfully') } catch (error) { setMessage(error.response?.data?.message || 'Unable to update profile') } }
    const selectProfileImage = async event => { const file = event.target.files?.[0]; if (file) { const image = await compressImage(file); setForm(current => ({ ...current, image })) } }
    const savePassword = async event => { event.preventDefault(); try { await api.patch('/users/password', password); setPassword({ currentPassword: '', newPassword: '' }); setMessage('Password changed successfully') } catch (error) { setMessage(error.response?.data?.message || 'Unable to change password') } }
    return <div className="max-w-2xl mx-auto px-6 md:px-10 py-12"><h1 className="text-2xl font-semibold">Profile</h1><form onSubmit={saveProfile} className="border rounded-lg p-5 mt-7 space-y-3"><h2 className="text-sm font-medium">Personal details</h2><div className="flex items-center gap-4"><img src={form.image || '/vite.svg'} className="h-16 w-16 rounded-full object-cover border" alt="Profile preview" /><label className="cursor-pointer text-xs text-primary">Upload profile photo<input type="file" accept="image/*" onChange={selectProfileImage} className="hidden" /></label></div><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full border rounded p-2 text-sm" /><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full border rounded p-2 text-sm" /><button className="bg-primary text-white rounded px-4 py-2 text-sm">Save profile</button></form><form onSubmit={savePassword} className="border rounded-lg p-5 mt-5 space-y-3"><h2 className="text-sm font-medium">Change password</h2><input required type="password" value={password.currentPassword} onChange={e => setPassword({ ...password, currentPassword: e.target.value })} placeholder="Current password" className="w-full border rounded p-2 text-sm" /><input required minLength="6" type="password" value={password.newPassword} onChange={e => setPassword({ ...password, newPassword: e.target.value })} placeholder="New password" className="w-full border rounded p-2 text-sm" /><button className="border border-primary text-primary rounded px-4 py-2 text-sm">Change password</button></form>{message && <p className="text-sm text-gray-500 mt-4">{message}</p>}</div>
}

export default Profile