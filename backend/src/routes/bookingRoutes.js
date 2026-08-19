import express from 'express'
import { cancelBooking, createBooking, getBooking, getMyBookings, getOwnerBookings, getOwnerDashboard, updateBookingStatus } from '../controllers/bookingController.js'
import protect from '../middleware/authMiddleware.js'
import requireRole from '../middleware/roleMiddleware.js'

const router = express.Router()
router.use(protect)
router.post('/', createBooking)
router.get('/my', getMyBookings)
router.get('/owner', requireRole('owner', 'admin'), getOwnerBookings)
router.get('/owner/dashboard', requireRole('owner', 'admin'), getOwnerDashboard)
router.get('/:id', getBooking)
router.put('/:id/status', requireRole('owner', 'admin'), updateBookingStatus)
router.patch('/:id/status', requireRole('owner', 'admin'), updateBookingStatus)
router.delete('/:id', cancelBooking)
router.patch('/:id/cancel', cancelBooking)
export default router