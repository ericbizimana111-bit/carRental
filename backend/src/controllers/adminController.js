import mongoose from 'mongoose'
import User from '../models/User.js'
import Car from '../models/Car.js'
import Booking from '../models/Booking.js'

export const getAdminStats = async (req, res) => {
    const [users, owners, cars, bookings] = await Promise.all([
        User.countDocuments(), User.countDocuments({ role: 'owner' }), Car.countDocuments(), Booking.find().select('totalPrice status')
    ])
    res.json({
        success: true, data: {
            users, owners, cars, bookings: bookings.length,
            revenue: bookings.filter(booking => booking.status === 'completed').reduce((total, booking) => total + booking.totalPrice, 0)
        }
    })
}

export const getAdminUsers = async (req, res) => {
    const users = await User.find().select('-password').sort('-createdAt')
    res.json({ success: true, data: users })
}

export const updateUserRole = async (req, res) => {
    const { role } = req.body
    if (!['user', 'owner', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid user role' })
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid user ID' })
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ success: false, message: 'You cannot change your own role' })
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
}

export const deleteUser = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid user ID' })
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ success: false, message: 'You cannot delete your own account' })
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, message: 'User deleted successfully' })
}

export const getAdminCars = async (req, res) => {
    const cars = await Car.find().populate('owner', 'name email').sort('-createdAt')
    res.json({ success: true, data: cars })
}

export const getAdminBookings = async (req, res) => {
    const filters = {}
    if (req.query.owner && mongoose.Types.ObjectId.isValid(req.query.owner)) {
        filters.owner = req.query.owner
    }
    const bookings = await Booking.find(filters)
        .populate('car', 'brand model image')
        .populate('user', 'name email')
        .populate('owner', 'name email')
        .sort('-createdAt')
    res.json({ success: true, data: bookings })
}