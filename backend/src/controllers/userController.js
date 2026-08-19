import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, image: user.image, phone: user.phone })

export const getProfile = async (req, res) => res.json({ success: true, data: publicUser(req.user) })

export const updateProfile = async (req, res) => {
    const updates = {}
    if (typeof req.body.name === 'string' && req.body.name.trim()) updates.name = req.body.name.trim()
    if (typeof req.body.phone === 'string') updates.phone = req.body.phone.trim()
    if (typeof req.body.image === 'string') updates.image = req.body.image.trim()
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    res.json({ success: true, data: publicUser(user) })
}

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword || newPassword.length < 6) return res.status(400).json({ success: false, message: 'Current password and a new password of at least 6 characters are required' })
    const user = await User.findById(req.user._id)
    if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    user.password = await bcrypt.hash(newPassword, 12)
    await user.save()
    res.json({ success: true, message: 'Password changed successfully' })
}