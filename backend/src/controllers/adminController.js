import mongoose from 'mongoose'
import User from '../models/User.js'
import Car from '../models/Car.js'
import Booking from '../models/Booking.js'
import Notification from '../models/Notification.js'

export const getAdminStats = async (req, res) => {
    const [users, owners, cars, bookings] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'owner' }),
        Car.countDocuments(),
        Booking.find().select('totalPrice status owner')
    ])

    const completedBookings = bookings.filter(b => b.status === 'completed')
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const platformRevenue = Math.round(totalRevenue * 0.05 * 100) / 100
    const ownerEarnings = Math.round(totalRevenue * 0.95 * 100) / 100

    const carDistribution = await Car.aggregate([
        { $group: { _id: '$owner', count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'owner' } },
        { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1, count: 1, ownerName: '$owner.name' } },
        { $sort: { count: -1 } }
    ])

    const revenuePerOwner = await Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$owner', totalBookings: { $sum: 1 }, totalRevenue: { $sum: '$totalPrice' } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'owner' } },
        { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1, totalBookings: 1, totalRevenue: 1, ownerName: '$owner.name', ownerEarnings: { $multiply: ['$totalRevenue', 0.95] }, platformFee: { $multiply: ['$totalRevenue', 0.05] } } },
        { $sort: { totalRevenue: -1 } }
    ])

    res.json({
        success: true, data: {
            users, owners, cars, bookings: bookings.length,
            totalRevenue,
            platformRevenue,
            ownerEarnings,
            completedBookings: completedBookings.length,
            pendingListings: await Car.countDocuments({ listingStatus: 'pending' }),
            carDistribution,
            revenuePerOwner
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
    const cars = await Car.find().populate('owner', 'name email image').sort('-createdAt')
    res.json({ success: true, data: cars })
}

export const getPendingCars = async (req, res) => {
    const cars = await Car.find({ listingStatus: 'pending' }).populate('owner', 'name email image').sort('-createdAt')
    res.json({ success: true, data: cars })
}

export const approveCar = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid car ID' })
    const car = await Car.findByIdAndUpdate(req.params.id, { listingStatus: 'live', rejectionReason: '' }, { new: true }).populate('owner', 'name email image')
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' })
    await Notification.create({ user: car.owner._id, type: 'listing_approved', title: 'Listing approved', message: `Your ${car.brand} ${car.model} listing has been approved and is now live.` })
    res.json({ success: true, data: car })
}

export const rejectCar = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid car ID' })
    const reason = req.body.reason || 'Listing does not meet our standards'
    const car = await Car.findByIdAndUpdate(req.params.id, { listingStatus: 'rejected', rejectionReason: reason }, { new: true }).populate('owner', 'name email image')
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' })
    await Notification.create({ user: car.owner._id, type: 'listing_rejected', title: 'Listing rejected', message: `Your ${car.brand} ${car.model} listing was not approved. Reason: ${reason}` })
    res.json({ success: true, data: car })
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
