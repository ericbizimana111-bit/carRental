export const notFound = (req, res) => res.status(404).json({ success: false, message: 'Route not found' })

export const errorHandler = (error, req, res, next) => {
    const status = error.statusCode || (error.name === 'ValidationError' ? 400 : 500)
    if (status >= 500) console.error(error)
    res.status(status).json({ success: false, message: status >= 500 ? 'Internal server error' : error.message })
}