import express from 'express'
import { changePassword, getProfile, updateProfile } from '../controllers/userController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(protect)
router.get('/profile', getProfile)
router.patch('/profile', updateProfile)
router.patch('/password', changePassword)
export default router