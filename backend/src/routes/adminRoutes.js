import express from 'express'
import { deleteUser, getAdminBookings, getAdminCars, getAdminStats, getAdminUsers, updateUserRole } from '../controllers/adminController.js'
import protect from '../middleware/authMiddleware.js'
import requireRole from '../middleware/roleMiddleware.js'

const router = express.Router()
router.use(protect, requireRole('admin'))
router.get('/stats', getAdminStats)
router.get('/users', getAdminUsers)
router.patch('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/cars', getAdminCars)
router.get('/bookings', getAdminBookings)
export default router