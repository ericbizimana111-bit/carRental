import express from 'express'
import { createPayment, getMyPayment } from '../controllers/paymentController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(protect)
router.post('/:bookingId/create', createPayment)
router.get('/:bookingId', getMyPayment)
export default router