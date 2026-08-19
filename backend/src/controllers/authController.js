import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateTokens.js'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '../services/emailService.js'

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            })
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        })

        const token = generateToken(user._id)

        res.cookie('token', token, cookieOptions)

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            })
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const token = generateToken(user._id)

        res.cookie('token', token, cookieOptions)

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed'
        })
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })

    res.json({
        success: true,
        message: 'Logout successful'
    })
}

export const getMe = async (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            image: req.user.image,
            phone: req.user.phone
        }
    })
}

export const forgotPassword = async (req, res) => {
    const response = { success: true, message: 'If an account matches that email, reset instructions will be sent.' }
    const email = req.body.email?.toLowerCase().trim()
    if (!email) return res.json(response)

    const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpires')
    if (!user) return res.json(response)

    const token = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000
    await user.save()
    await sendPasswordResetEmail({ email: user.email, token })
    res.json(response)
}

export const resetPassword = async (req, res) => {
    const tokenHash = crypto.createHash('sha256').update(req.params.token || '').digest('hex')
    const user = await User.findOne({ resetPasswordToken: tokenHash, resetPasswordExpires: { $gt: Date.now() } }).select('+resetPasswordToken +resetPasswordExpires')
    if (!user) return res.status(400).json({ success: false, message: 'Reset token is invalid or expired' })
    if (!req.body.password || req.body.password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })

    user.password = await bcrypt.hash(req.body.password, 12)
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()
    res.json({ success: true, message: 'Password reset successfully' })
}