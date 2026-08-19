import express from 'express'
import { createCar, deleteCar, getCar, getCars, getOwnerCars, updateCar } from '../controllers/carController.js'
import protect from '../middleware/authMiddleware.js'
import requireRole from '../middleware/roleMiddleware.js'

const router = express.Router()
router.get('/', getCars)
router.get('/owner/list', protect, requireRole('owner', 'admin'), getOwnerCars)
router.get('/:id', getCar)
router.post('/', protect, requireRole('owner', 'admin'), createCar)
router.put('/:id', protect, requireRole('owner', 'admin'), updateCar)
router.delete('/:id', protect, requireRole('owner', 'admin'), deleteCar)
export default router