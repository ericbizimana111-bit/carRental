export const createProviderPayment = async ({ amount, currency, bookingId }) => {
    if (!process.env.PAYMENT_PROVIDER || !process.env.PAYMENT_SECRET) {
        const error = new Error('Payment provider is not configured')
        error.statusCode = 503
        throw error
    }

    void amount
    void currency
    void bookingId
    throw new Error('Payment provider adapter is not implemented')
}