import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        const user = await User.findById(decoded.userId).select('-password')

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            })
        }

        req.user = user

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired session'
        })
    }
}

export default protect