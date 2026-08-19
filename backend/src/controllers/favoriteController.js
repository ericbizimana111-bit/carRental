import mongoose from 'mongoose'
import Favorite from '../models/Favorite.js'

export const toggleFavorite = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.carId)) return res.status(400).json({ success: false, message: 'Invalid car ID' })
    const existing = await Favorite.findOne({ user: req.user._id, car: req.params.carId })
    if (existing) {
        await existing.deleteOne()
        return res.json({ success: true, favorite: false })
    }
    await Favorite.create({ user: req.user._id, car: req.params.carId })
    res.json({ success: true, favorite: true })
}

export const getFavorites = async (req, res) => {
    const favorites = await Favorite.find({ user: req.user._id }).populate({ path: 'car', populate: { path: 'owner', select: 'name email image' } }).sort('-createdAt')
    res.json({ success: true, data: favorites.map(favorite => favorite.car) })
}

export const getFavoriteStatus = async (req, res) => {
    const favorite = await Favorite.exists({ user: req.user._id, car: req.params.carId })
    res.json({ success: true, favorite: Boolean(favorite) })
}