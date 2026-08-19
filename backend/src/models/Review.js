import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 }
}, { timestamps: true })

reviewSchema.index({ user: 1, car: 1 }, { unique: true })

const Review = mongoose.model('Review', reviewSchema)
export default Review