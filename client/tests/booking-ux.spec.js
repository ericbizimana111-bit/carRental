import { test, expect } from '@playwright/test'

const apiBase = process.env.API_URL || 'http://localhost:5000/api'
const ownerEmail = process.env.E2E_OWNER_EMAIL || 'owner@local.test'
const ownerPassword = process.env.E2E_OWNER_PASSWORD || 'AuditPass123!'
const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@local.test'
const userPassword = process.env.E2E_USER_PASSWORD || 'BrowserTestPass123!'
const testEmail = `e2e-suite-${Date.now()}@test.local`
const testCarName = `E2E Suite Car ${Date.now()}`

let testUserId
let testCarId
let testBookingId

const loginThroughUi = async (page, email, password) => {
    await page.goto('/login')
    await page.getByPlaceholder('Email address').fill(email)
    await page.getByPlaceholder('Password').fill(password)
    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(page).toHaveURL(/\/$/)
}

const fillBookingDates = async (page) => {
    await page.getByLabel('Pickup location').fill('Chicago')
    await page.getByLabel('Pickup date').fill('2099-12-10')
    await page.getByLabel('Return date').fill('2099-12-12')
}

const openCarDetails = async (page) => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
        await page.goto(`/car-details/${testCarId}`)
        try {
            await expect(page.getByLabel('Pickup location')).toBeVisible({ timeout: 5000 })
            return
        } catch (error) {
            if (attempt === 2) throw error
            await page.reload({ waitUntil: 'networkidle' })
        }
    }
}

test.describe('Home page', () => {
    test('loads and displays hero section with featured vehicles', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByRole('heading', { name: 'Luxury Cars On Rent' })).toBeVisible()
        await expect(page.getByText('featured Vehicles', { exact: false })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Search' })).toBeVisible()
    })
})

test.describe('Cars page', () => {
    test('loads and displays available cars', async ({ page }) => {
        await page.goto('/cars')
        await expect(page.getByText('Available Cars')).toBeVisible()
        await expect(page.getByText('Showing')).toBeVisible()
    })
})

test.describe('Signup flow', () => {
    test('creates a new account and logs in', async ({ page }) => {
        await page.goto('/signup')
        await expect(page.getByText('Create your account')).toBeVisible()
        await page.getByPlaceholder('Full name').fill('E2E Signup User')
        await page.getByPlaceholder('Email address').fill(`e2e-signup-${Date.now()}@test.local`)
        await page.getByPlaceholder('Password (6+ characters)').fill(userPassword)
        await page.getByRole('button', { name: 'Create account' }).click()
        await expect(page).toHaveURL(/\/$/, { timeout: 10000 })
    })

    test('rejects duplicate email', async ({ page }) => {
        await page.goto('/signup')
        await page.getByPlaceholder('Full name').fill('Duplicate User')
        await page.getByPlaceholder('Email address').fill(testEmail)
        await page.getByPlaceholder('Password (6+ characters)').fill(userPassword)
        await page.getByRole('button', { name: 'Create account' }).click()
        await expect(page.getByText('already registered', { exact: false })).toBeVisible({ timeout: 5000 })
    })
})

test.describe('Login flow', () => {
    test('logs in with valid credentials', async ({ page }) => {
        await loginThroughUi(page, ownerEmail, ownerPassword)
    })

    test('rejects invalid credentials', async ({ page }) => {
        await page.goto('/login')
        await page.getByPlaceholder('Email address').fill('nonexistent@test.local')
        await page.getByPlaceholder('Password').fill('wrongpassword')
        await page.getByRole('button', { name: 'Log in' }).click()
        await expect(page.getByText('Invalid email or password')).toBeVisible()
    })
})

test.describe('booking UX regression', () => {
    test.describe.configure({ mode: 'serial' })

    test.beforeAll(async ({ request }) => {
        const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
        expect(ownerLogin.ok()).toBeTruthy()
        const carResponse = await request.post(`${apiBase}/cars`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
        expect(carResponse.status()).toBe(201)
        testCarId = (await carResponse.json()).data._id
        let userResponse = await request.post(`${apiBase}/auth/register`, { data: { name: 'E2E Booking User', email: testEmail, password: userPassword } })
        if (userResponse.status() === 409) {
            userResponse = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
            expect(userResponse.ok()).toBeTruthy()
            testUserId = (await userResponse.json()).user.id
        } else {
            expect(userResponse.status()).toBe(201)
            testUserId = (await userResponse.json()).user.id
        }
    })

    test.afterAll(async ({ request }) => {
        if (testBookingId) {
            const userLogin = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
            if (userLogin.ok()) await request.delete(`${apiBase}/bookings/${testBookingId}`)
        }
        const adminLogin = await request.post(`${apiBase}/auth/login`, { data: { email: adminEmail, password: ownerPassword } })
        if (!adminLogin.ok()) return
        if (testCarId) await request.delete(`${apiBase}/cars/${testCarId}`)
        if (testUserId) await request.delete(`${apiBase}/admin/users/${testUserId}`)
    })

    test('Car Details loads booking fields', async ({ page }) => {
        await openCarDetails(page)
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
        await openCarDetails(page)
        await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
        await request.put(`${apiBase}/cars/${testCarId}`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
    })

    test('invalid dates are rejected inline', async ({ page }) => {
        await loginThroughUi(page, testEmail, userPassword)
        await openCarDetails(page)
        await expect(page.getByText(testCarName)).toBeVisible()
        await page.getByLabel('Pickup location').fill('Chicago')
        await page.getByLabel('Pickup date').fill('2099-12-12')
        await page.getByLabel('Return date').fill('2099-12-10')
        await expect(page.getByText('Return date must be on or after pickup date')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
    })

    test('authenticated user books and sees the created booking', async ({ page }) => {
        await loginThroughUi(page, testEmail, userPassword)
        await openCarDetails(page)
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

    test('overlapping bookings are rejected', async ({ request }) => {
        const userLogin = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
        expect(userLogin.ok()).toBeTruthy()
        const response = await request.post(`${apiBase}/bookings`, { data: { carId: testCarId, pickupLocation: 'Chicago', pickupDate: '2099-12-11', returnDate: '2099-12-13' } })
        expect(response.status()).toBe(409)
        const body = await response.json()
        expect(body.message).toMatch(/already booked|conflict/i)
    })

    test('owner sees and updates the car booking status', async ({ page }) => {
        await loginThroughUi(page, ownerEmail, ownerPassword)
        await page.goto('/owner/manage-bookings')
        const bookingRow = page.getByTestId('booking-row').filter({ hasText: testCarName })
        await expect(bookingRow).toBeVisible()
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
        await openCarDetails(page)
        await fillBookingDates(page)
        await page.getByRole('button', { name: 'Log in to book' }).click()
        await expect(page).toHaveURL(/\/login$/)
    })
})

test.describe('Admin protection', () => {
    test('non-admin user cannot access admin dashboard', async ({ page }) => {
        await loginThroughUi(page, ownerEmail, ownerPassword)
        await page.goto('/admin')
        await expect(page).toHaveURL(/\/$/, { timeout: 5000 })
    })

    test('admin can access admin dashboard', async ({ page }) => {
        await loginThroughUi(page, adminEmail, ownerPassword)
        await page.goto('/admin')
        await expect(page.getByText('Admin Console')).toBeVisible()
    })

    test('admin can update a user role from the dashboard', async ({ page, request }) => {
        const roleEmail = `admin-role-${Date.now()}@test.local`
        const registerResponse = await request.post(`${apiBase}/auth/register`, { data: { name: 'Admin Role User', email: roleEmail, password: userPassword } })
        expect(registerResponse.status()).toBe(201)
        const { user: { id: userId } } = await registerResponse.json()

        await loginThroughUi(page, adminEmail, ownerPassword)
        await page.goto('/admin/users')

        const userRow = page.locator('[data-testid="admin-user-row"]', { hasText: 'Admin Role User' })
        await expect(userRow).toBeVisible({ timeout: 10000 })
        await userRow.locator('select').selectOption('owner')
        await userRow.getByRole('button', { name: 'Save role' }).click()
        await expect(userRow).toContainText('Owner')

        await request.delete(`${apiBase}/admin/users/${userId}`)
    })
})

test.describe('Logout flow', () => {
    const logoutEmail = `e2e-logout-${Date.now()}@test.local`

    test('logging out clears the session', async ({ page }) => {
        await page.goto('/signup')
        await page.getByPlaceholder('Full name').fill('Logout Test User')
        await page.getByPlaceholder('Email address').fill(logoutEmail)
        await page.getByPlaceholder('Password (6+ characters)').fill(userPassword)
        await page.getByRole('button', { name: 'Create account' }).click()
        await expect(page).toHaveURL(/\/$/, { timeout: 10000 })
        await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
        await page.getByRole('button', { name: 'Logout' }).click()
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
        await page.goto('/my-bookings')
        await expect(page).toHaveURL(/\/login$/)
    })
})
