import express from 'express'
import { createReview, getCarReviews } from '../controllers/reviewController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()
router.get('/:carId', getCarReviews)
router.post('/:carId', protect, createReview)
export default router