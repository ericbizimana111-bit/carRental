import mongoose from 'mongoose'

const carSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1900, max: 2100 },
    category: { type: String, required: true, trim: true },
    seating_capacity: { type: Number, required: true, min: 1, max: 50 },
    fuel_type: { type: String, required: true, trim: true },
    transmission: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    documentation: { type: String, default: '', trim: true },
    isAvailable: { type: Boolean, default: true, index: true },
    listingStatus: { type: String, enum: ['pending', 'live', 'rejected'], default: 'pending', index: true },
    rejectionReason: { type: String, default: '', trim: true }
}, { timestamps: true })

carSchema.index({ category: 1, isAvailable: 1 })
carSchema.index({ brand: 1, model: 1 })

const Car = mongoose.model('Car', carSchema)

export default Car