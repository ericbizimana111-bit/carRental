import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pickupLocation: { type: String, required: true, trim: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'declined', 'cancelled', 'completed'], default: 'pending', index: true },
    paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'refunded'], default: 'unpaid' }
}, { timestamps: true })

bookingSchema.index({ car: 1, pickupDate: 1, returnDate: 1, status: 1 })

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking