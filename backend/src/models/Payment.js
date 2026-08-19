import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'usd', lowercase: true },
    provider: { type: String, required: true },
    providerPaymentId: { type: String, default: '', index: true },
    status: { type: String, enum: ['created', 'pending', 'paid', 'failed', 'refunded'], default: 'created', index: true }
}, { timestamps: true })

const Payment = mongoose.model('Payment', paymentSchema)
export default Payment