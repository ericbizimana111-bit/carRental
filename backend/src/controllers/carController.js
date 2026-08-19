import mongoose from 'mongoose'
import Car from '../models/Car.js'

const isValidId = id => mongoose.Types.ObjectId.isValid(id)
const getCarPayload = body => ({
    brand: body.brand, model: body.model, image: body.image, year: body.year,
    category: body.category, seating_capacity: body.seating_capacity,
    fuel_type: body.fuel_type, transmission: body.transmission,
    pricePerDay: body.pricePerDay, location: body.location,
    description: body.description, isAvailable: body.isAvailable
})

const sendError = (res, error) => res.status(error.name === 'ValidationError' ? 400 : 500).json({
    success: false,
    message: error.name === 'ValidationError' ? error.message : 'Unable to process car request'
})

export const getCars = async (req, res) => {
    try {
        const { search, location, category, transmission, fuel_type, seating_capacity, minPrice, maxPrice, isAvailable, sort = '-createdAt', page = 1, limit = 12 } = req.query
        const filters = {}
        if (search) {
            const expression = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            filters.$or = [{ brand: expression }, { model: expression }, { location: expression }]
        }
        if (location) filters.location = new RegExp(location, 'i')
        if (category && category !== 'All') filters.category = category
        if (transmission && transmission !== 'All') filters.transmission = transmission
        if (fuel_type && fuel_type !== 'All') filters.fuel_type = fuel_type
        if (seating_capacity) filters.seating_capacity = { $gte: Number(seating_capacity) }
        if (isAvailable !== undefined) filters.isAvailable = isAvailable === 'true'
        if (minPrice || maxPrice) filters.pricePerDay = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) }

        const safePage = Math.max(Number(page) || 1, 1)
        const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50)
        const sortValue = sort === 'priceAsc' ? 'pricePerDay' : sort === 'priceDesc' ? '-pricePerDay' : '-createdAt'
        const [cars, total] = await Promise.all([
            Car.find(filters).populate('owner', 'name email image').sort(sortValue).skip((safePage - 1) * safeLimit).limit(safeLimit),
            Car.countDocuments(filters)
        ])
        res.json({ success: true, data: cars, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } })
    } catch (error) { sendError(res, error) }
}

export const getCar = async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid car ID' })
    const car = await Car.findById(req.params.id).populate('owner', 'name email image')
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' })
    res.json({ success: true, data: car })
}

export const createCar = async (req, res) => {
    try {
        const car = await Car.create({ ...getCarPayload(req.body), owner: req.user._id })
        res.status(201).json({ success: true, data: await car.populate('owner', 'name email image') })
    } catch (error) { sendError(res, error) }
}

export const updateCar = async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid car ID' })
    const car = await Car.findById(req.params.id)
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' })
    if (req.user.role !== 'admin' && car.owner.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'You can only update your own cars' })
    try {
        Object.assign(car, getCarPayload(req.body))
        await car.save()
        res.json({ success: true, data: await car.populate('owner', 'name email image') })
    } catch (error) { sendError(res, error) }
}

export const deleteCar = async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid car ID' })
    const car = await Car.findById(req.params.id)
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' })
    if (req.user.role !== 'admin' && car.owner.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'You can only delete your own cars' })
    await car.deleteOne()
    res.json({ success: true, message: 'Car deleted successfully' })
}

export const getOwnerCars = async (req, res) => {
    const cars = await Car.find({ owner: req.user._id }).populate('owner', 'name email image').sort('-createdAt')
    res.json({ success: true, data: cars })
}