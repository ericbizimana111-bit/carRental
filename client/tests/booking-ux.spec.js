import { test, expect } from '@playwright/test'

const apiBase = process.env.API_URL || 'http://localhost:5000/api'
const ownerEmail = process.env.E2E_OWNER_EMAIL || 'owner@local.test'
const ownerPassword = process.env.E2E_OWNER_PASSWORD || 'AuditPass123!'
const userPassword = process.env.E2E_USER_PASSWORD || 'BrowserTestPass123!'
const testEmail = `e2e-booking-${Date.now()}@test.local`
const testCarName = `E2E Test Car ${Date.now()}`
let testUserId
let testCarId
let testBookingId

const apiJson = value => ({ data: value })

const loginThroughUi = async (page, email, password) => {
    await page.goto('/login')
    await page.getByPlaceholder('Email address').fill(email)
    await page.getByPlaceholder('Password').fill(password)
    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(page).toHaveURL(/\/$/)
}

const fillBookingDates = async page => {
    await page.getByLabel('Pickup location').fill('Chicago')
    await page.getByLabel('Pickup date').fill('2099-11-10')
    await page.getByLabel('Return date').fill('2099-11-12')
}

test.describe('booking UX regression', () => {
    test.describe.configure({ mode: 'serial' })

    test.beforeAll(async ({ request }) => {
        const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
        expect(ownerLogin.ok()).toBeTruthy()
        const carResponse = await request.post(`${apiBase}/cars`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
        expect(carResponse.status()).toBe(201)
        testCarId = (await carResponse.json()).data._id
        const userResponse = await request.post(`${apiBase}/auth/register`, { data: { name: 'E2E Booking User', email: testEmail, password: userPassword } })
        expect(userResponse.status()).toBe(201)
        testUserId = (await userResponse.json()).user.id
    })

    test.afterAll(async ({ request }) => {
        if (testBookingId) {
            const userLogin = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
            if (userLogin.ok()) await request.delete(`${apiBase}/bookings/${testBookingId}`)
        }
        const adminLogin = await request.post(`${apiBase}/auth/login`, { data: { email: 'admin@local.test', password: ownerPassword } })
        if (!adminLogin.ok()) return
        if (testCarId) await request.delete(`${apiBase}/cars/${testCarId}`)
        if (testUserId) await request.delete(`${apiBase}/admin/users/${testUserId}`)
    })

    test('Car Details loads booking fields', async ({ page }) => {
        await page.goto(`/car-details/${testCarId}`)
        await expect(page.getByText(testCarName)).toBeVisible()
        await expect(page.getByText('Pickup Date', { exact: true })).toBeVisible()
        await expect(page.getByText('Return Date', { exact: true })).toBeVisible()
        await expect(page.getByText('Rental days', { exact: true })).toBeVisible()
        await expect(page.getByText('Estimated total', { exact: true })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Book Now' })).toBeVisible()
    })

    test('unavailable car disables booking', async ({ page, request }) => {
        const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
        expect(ownerLogin.ok()).toBeTruthy()
        const update = await request.put(`${apiBase}/cars/${testCarId}`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: false } })
        expect(update.ok()).toBeTruthy()
        await page.goto(`/car-details/${testCarId}`)
        await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
        await request.put(`${apiBase}/cars/${testCarId}`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
    })

    test('invalid dates are rejected inline', async ({ page }) => {
        await loginThroughUi(page, testEmail, userPassword)
        await page.goto(`/car-details/${testCarId}`)
        await expect(page.getByText(testCarName)).toBeVisible()
        await page.getByLabel('Pickup location').fill('Chicago')
        await page.getByLabel('Pickup date').fill('2099-11-12')
        await page.getByLabel('Return date').fill('2099-11-10')
        await expect(page.getByText('Return date must be on or after pickup date')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
    })

    test('authenticated user books and sees the created booking', async ({ page }) => {
        await loginThroughUi(page, testEmail, userPassword)
        await page.goto(`/car-details/${testCarId}`)
        await fillBookingDates(page)
        await expect(page.getByText('Rental days').locator('..')).toContainText('2')
        await expect(page.getByText('Estimated total').locator('..')).toContainText('$350')
        await page.getByRole('button', { name: 'Book Now' }).click()
        await expect(page).toHaveURL('/my-bookings', { timeout: 10000 })
        await expect(page.getByText(testCarName)).toBeVisible()
        await expect(page.getByText('$350')).toBeVisible()
        const bookingResponse = await page.request.get(`${apiBase}/bookings/my`)
        const bookingData = await bookingResponse.json()
        testBookingId = bookingData.data.find(booking => booking.car?._id === testCarId)?._id
        expect(testBookingId).toBeTruthy()
    })

    test('owner sees and updates the car booking status', async ({ page }) => {
        await loginThroughUi(page, ownerEmail, ownerPassword)
        const ownerBookingsResponse = page.waitForResponse('**/api/bookings/owner')
        await page.goto('/owner/manage-bookings')
        const ownerBookings = await ownerBookingsResponse
        expect(ownerBookings.status()).toBe(200)
        console.log(`OWNER_BOOKINGS_RESPONSE ${JSON.stringify((await ownerBookings.json()).data.map(booking => booking.car?.brand))}`)
        await page.waitForTimeout(1000)
        console.log(`OWNER_PAGE_TEXT ${await page.locator('body').innerText()}`)
        const bookingRow = page.getByTestId('booking-row').filter({ hasText: testCarName })
        await expect(bookingRow).toBeVisible()
        await expect(bookingRow).toContainText('E2E Booking User')
        await bookingRow.getByRole('button', { name: 'Confirm' }).click()
        await expect(page.getByText('Confirmed')).toBeVisible()
    })

    test('user cancels the eligible booking', async ({ page }) => {
        await loginThroughUi(page, testEmail, userPassword)
        await page.goto('/my-bookings')
        page.once('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'Cancel booking' }).click()
        await expect(page.getByText('Cancelled')).toBeVisible()
    })

    test('unauthenticated booking action goes to Login', async ({ page }) => {
        await page.goto(`/car-details/${testCarId}`)
        await fillBookingDates(page)
        await page.getByRole('button', { name: 'Log in to book' }).click()
        await expect(page).toHaveURL(/\/login$/)
    })
})
