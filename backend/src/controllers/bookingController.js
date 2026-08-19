import mongoose from 'mongoose'
import Booking from '../models/Booking.js'
import Car from '../models/Car.js'
import Notification from '../models/Notification.js'

const isValidId = id => mongoose.Types.ObjectId.isValid(id) 
const startOfDay = date => {
    const value = new Date(date)
    value.setHours(0, 0, 0, 0)
    return value
}
const rentalDaysBetween = (pickupDate, returnDate) => Math.max(Math.ceil((returnDate - pickupDate) / 86400000), 1)
const populateBooking = query => query
    .populate('car', 'brand model image year category location pricePerDay')
    .populate('user', 'name email image')
    .populate('owner', 'name email image')
const populateBookingDocument = booking => booking.populate([
    { path: 'car', select: 'brand model image year category location pricePerDay' },
    { path: 'user', select: 'name email image' },
    { path: 'owner', select: 'name email image' }
])

export const createBooking = async (req, res) => {
    const { carId, pickupLocation, pickupDate, returnDate } = req.body 
    if (!isValidId(carId) || !pickupLocation || !pickupDate || !returnDate) {
        return res.status(400).json({ success: false, message: 'Car, location, and rental dates are required' })
    }

    const pickup = startOfDay(pickupDate)
    const returned = startOfDay(returnDate)
    const today = startOfDay(new Date())
    if (Number.isNaN(pickup.getTime()) || Number.isNaN(returned.getTime())) return res.status(400).json({ success: false, message: 'Invalid rental dates' })
    if (pickup < today) return res.status(400).json({ success: false, message: 'Pickup date cannot be in the past' })
    if (returned < pickup) return res.status(400).json({ success: false, message: 'Return date cannot be before pickup date' })

    const car = await Car.findById(carId)
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' })
    if (!car.isAvailable) return res.status(409).json({ success: false, message: 'This car is not available' })

    const overlap = await Booking.exists({ 
        car: car._id,
        status: { $in: ['pending', 'confirmed'] },
        pickupDate: { $lte: returned },
        returnDate: { $gte: pickup }
    })
    if (overlap) return res.status(409).json({ success: false, message: 'These dates are already booked' })

    const rentalDays = rentalDaysBetween(pickup, returned)
    const booking = await Booking.create({ 
        user: req.user._id,
        car: car._id,
        owner: car.owner,
        pickupLocation: pickupLocation.trim(),
        pickupDate: pickup,
        returnDate: returned,
        totalPrice: rentalDays * car.pricePerDay 
    })

    await Notification.create({ user: car.owner, type: 'new_booking', title: 'New booking request', message: `A customer requested ${car.brand} ${car.model}.` })

    res.status(201).json({ success: true, data: await populateBookingDocument(booking) })
}

export const getMyBookings = async (req, res) => {
    const bookings = await populateBooking(Booking.find({ user: req.user._id }).sort('-createdAt'))
    res.json({ success: true, data: bookings })
}

export const getBooking = async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid booking ID' })
    const filter = req.user.role === 'admin'
        ? { _id: req.params.id }
        : req.user.role === 'owner'
            ? { _id: req.params.id, owner: req.user._id }
            : { _id: req.params.id, user: req.user._id }
    const booking = await populateBooking(Booking.findOne(filter))
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    res.json({ success: true, data: booking })
}

export const cancelBooking = async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid booking ID' })
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    if (['cancelled', 'completed'].includes(booking.status)) return res.status(400).json({ success: false, message: 'This booking cannot be cancelled' }) 
    booking.status = 'cancelled'
    await booking.save()
    await Notification.create({ user: booking.owner, type: 'booking_cancelled', title: 'Booking cancelled', message: 'A customer cancelled a booking for your vehicle.' })
    res.json({ success: true, data: await populateBookingDocument(booking) })
}

export const getOwnerBookings = async (req, res) => {
    const bookings = await populateBooking(Booking.find({ owner: req.user._id }).sort('-createdAt'))
    res.json({ success: true, data: bookings })
}

export const updateBookingStatus = async (req, res) => {
    const { status } = req.body
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid booking status' })
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid booking ID' })

    const booking = await Booking.findOne(req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id })
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    if (status === 'confirmed') {
        const overlap = await Booking.exists({ _id: { $ne: booking._id }, car: booking.car, status: { $in: ['pending', 'confirmed'] }, pickupDate: { $lte: booking.returnDate }, returnDate: { $gte: booking.pickupDate } })
        if (overlap) return res.status(409).json({ success: false, message: 'These dates conflict with another confirmed booking' })
    }
    booking.status = status
    await booking.save()
    await Notification.create({ user: booking.user, type: `booking_${status}`, title: `Booking ${status}`, message: `Your booking for this vehicle is now ${status}.` })
    res.json({ success: true, data: await populateBookingDocument(booking) })
}

export const getOwnerDashboard = async (req, res) => {
    const [cars, bookings] = await Promise.all([
        Car.find({ owner: req.user._id }).select('_id'),
        Booking.find({ owner: req.user._id }).populate('car', 'brand model image').sort('-createdAt')
    ])
    const completed = bookings.filter(booking => booking.status === 'completed')
    res.json({ success: true, data: {
        totalCars: cars.length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(booking => booking.status === 'pending').length,
        completedBookings: completed.length,
        revenue: completed.reduce((total, booking) => total + booking.totalPrice, 0),
        monthlyRevenue: completed.reduce((total, booking) => total + booking.totalPrice, 0),
        recentBookings: bookings.slice(0, 5)
    } })
}