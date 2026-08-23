import mongoose from 'mongoose'
import Review from '../models/Review.js'

export const getCarReviews = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.carId)) return res.status(400).json({ success: false, message: 'Invalid car ID' })
    const reviews = await Review.find({ car: req.params.carId }).populate('user', 'name image').sort('-createdAt')
    const average = reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : 0
    res.json({ success: true, data: reviews, rating: Number(average.toFixed(1)), count: reviews.length })
}

export const createReview = async (req, res) => {
    const { rating, comment } = req.body
    if (!mongoose.Types.ObjectId.isValid(req.params.carId) || !rating || !comment?.trim()) return res.status(400).json({ success: false, message: 'Rating and comment are required' })

    try {
        const review = await Review.create({ user: req.user._id, car: req.params.carId, rating, comment })
        res.status(201).json({ success: true, data: await review.populate('user', 'name image') })
    } catch (error) {
        const duplicate = error.code === 11000
        res.status(duplicate ? 409 : 400).json({ success: false, message: duplicate ? 'You have already reviewed this car' : 'Unable to create review' })
    }
}