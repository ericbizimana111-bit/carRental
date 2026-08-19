import express from 'express'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../controllers/notificationController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(protect)
router.get('/', getNotifications)
router.patch('/read-all', markAllNotificationsRead)
router.patch('/:id/read', markNotificationRead)
export default router