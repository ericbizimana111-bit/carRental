import express from 'express'
import { deleteUser, getAdminBookings, getAdminCars, getAdminStats, getAdminUsers, approveCar, rejectCar, getPendingCars, updateUserRole, toggleFeatured } from '../controllers/adminController.js'
import protect from '../middleware/authMiddleware.js'
import requireRole from '../middleware/roleMiddleware.js'

const router = express.Router()
router.use(protect, requireRole('admin'))
router.get('/stats', getAdminStats)
router.get('/users', getAdminUsers)
router.patch('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/cars', getAdminCars)
router.get('/cars/pending', getPendingCars)
router.put('/cars/:id/approve', approveCar)
router.put('/cars/:id/reject', rejectCar)
router.patch('/cars/:id/featured', toggleFeatured)
router.get('/bookings', getAdminBookings)
export default router
