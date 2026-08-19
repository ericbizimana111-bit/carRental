import nodemailer from 'nodemailer'

const getTransporter = () => nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
})

export const sendPasswordResetEmail = async ({ email, token }) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Password reset email queued for ${email}: /reset-password/${token}`)
        return
    }

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error('Email service is not configured')
    }

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`
    await getTransporter().sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Reset your CarRental password',
        text: `Reset your password using this link: ${resetUrl}. This link expires in 15 minutes.`
    })
}