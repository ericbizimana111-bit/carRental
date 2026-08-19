import express from 'express'
import { getFavoriteStatus, getFavorites, toggleFavorite } from '../controllers/favoriteController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(protect)
router.get('/', getFavorites)
router.get('/:carId/status', getFavoriteStatus)
router.post('/:carId/toggle', toggleFavorite)
export default router