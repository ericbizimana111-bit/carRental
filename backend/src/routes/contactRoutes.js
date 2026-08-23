import express from 'express'
import ContactMessage from '../models/ContactMessage.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required' })
        }
        await ContactMessage.create({ name, email, message })
        res.status(201).json({ success: true, message: 'Message received successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to send message' })
    }
})

export default router
