import mongoose from 'mongoose'
import Booking from '../models/Booking.js'
import Payment from '../models/Payment.js'
import { createProviderPayment } from '../services/paymentService.js'

export const createPayment = async (req, res) => {
    const { bookingId } = req.params
    if (!mongoose.Types.ObjectId.isValid(bookingId)) return res.status(400).json({ success: false, message: 'Invalid booking ID' })
    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id })
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Cancelled bookings cannot be paid' })
    if (booking.paymentStatus === 'paid') return res.status(400).json({ success: false, message: 'Booking is already paid' })

    try {
        const providerPayment = await createProviderPayment({ amount: booking.totalPrice, currency: process.env.PAYMENT_CURRENCY || 'usd', bookingId: booking._id.toString() })
        const payment = await Payment.findOneAndUpdate({ booking: booking._id }, { booking: booking._id, user: req.user._id, amount: booking.totalPrice, currency: process.env.PAYMENT_CURRENCY || 'usd', provider: process.env.PAYMENT_PROVIDER, providerPaymentId: providerPayment.id, status: 'pending' }, { upsert: true, new: true })
        booking.paymentStatus = 'pending'
        await booking.save()
        res.status(201).json({ success: true, data: payment })
    } catch (error) {
        res.status(error.statusCode || 503).json({ success: false, message: error.statusCode ? error.message : 'Payment provider is unavailable' })
    }
}

export const getMyPayment = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) return res.status(400).json({ success: false, message: 'Invalid booking ID' })
    const payment = await Payment.findOne({ booking: req.params.bookingId, user: req.user._id })
    res.json({ success: true, data: payment })
}