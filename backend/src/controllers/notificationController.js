import mongoose from 'mongoose'
import Notification from '../models/Notification.js'

export const getNotifications = async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50)
    const unread = await Notification.countDocuments({ user: req.user._id, read: false })
    res.json({ success: true, data: notifications, unread })
}

export const markNotificationRead = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid notification ID' })
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true })
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' })
    res.json({ success: true, data: notification })
}

export const markAllNotificationsRead = async (req, res) => {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true })
    res.json({ success: true, message: 'Notifications marked as read' })
}