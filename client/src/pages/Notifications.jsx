import React, { useEffect, useState } from 'react'
import api from '../services/api'

const Notifications = () => {
    const [notifications, setNotifications] = useState([])
    const [error, setError] = useState('')
    const load = async () => {
        try { setNotifications((await api.get('/notifications')).data.data || []) } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load notifications') }
    }
    useEffect(() => {
        let active = true
        api.get('/notifications').then(response => { if (active) setNotifications(response.data.data || []) }).catch(requestError => { if (active) setError(requestError.response?.data?.message || 'Unable to load notifications') })
        return () => { active = false }
    }, [])
    const markRead = async id => { await api.patch(`/notifications/${id}/read`); load() }
    const markAll = async () => { await api.patch('/notifications/read-all'); load() }
    return <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <div className="flex justify-between items-center"><h1 className="text-2xl font-semibold">Notifications</h1><button onClick={markAll} className="text-xs text-primary">Mark all as read</button></div>
        {error && <p className="text-sm text-red-500 mt-5">{error}</p>}
        <div className="space-y-3 mt-7">{notifications.map(notification => <button key={notification._id} onClick={() => markRead(notification._id)} className={`w-full text-left border rounded-lg p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}><p className="text-sm font-medium">{notification.title}</p><p className="text-xs text-gray-500 mt-1">{notification.message}</p></button>)}</div>
    </div>
}

export default Notifications