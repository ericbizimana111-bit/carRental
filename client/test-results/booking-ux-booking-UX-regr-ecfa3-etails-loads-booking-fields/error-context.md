# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-ux.spec.js >> booking UX regression >> Car Details loads booking fields
- Location: tests\booking-ux.spec.js:64:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | const apiBase = process.env.API_URL || 'http://localhost:5000/api'
  4   | const ownerEmail = process.env.E2E_OWNER_EMAIL || 'owner@local.test'
  5   | const ownerPassword = process.env.E2E_OWNER_PASSWORD || 'AuditPass123!'
  6   | const userPassword = process.env.E2E_USER_PASSWORD || 'BrowserTestPass123!'
  7   | const testEmail = `e2e-booking-${Date.now()}@test.local`
  8   | const testCarName = `E2E Test Car ${Date.now()}`
  9   | let testUserId
  10  | let testCarId
  11  | let testBookingId
  12  | 
  13  | const loginThroughUi = async (page, email, password) => {
  14  |     await page.goto('/login')
  15  |     await page.getByPlaceholder('Email address').fill(email)
  16  |     await page.getByPlaceholder('Password').fill(password)
  17  |     await page.getByRole('button', { name: 'Log in' }).click()
  18  |     await expect(page).toHaveURL(/\/$/)
  19  | }
  20  | 
  21  | const fillBookingDates = async page => {
  22  |     await page.getByLabel('Pickup location').fill('Chicago')
  23  |     await page.getByLabel('Pickup date').fill('2099-11-10')
  24  |     await page.getByLabel('Return date').fill('2099-11-12')
  25  | }
  26  | const openCarDetails = async page => {
  27  |     for (let attempt = 0; attempt < 3; attempt += 1) {
  28  |         await page.goto(`/car-details/${testCarId}`)
  29  |         try {
  30  |             await expect(page.getByLabel('Pickup location')).toBeVisible({ timeout: 4000 })
  31  |             return
  32  |         } catch (error) {
  33  |             if (attempt === 2) throw error
  34  |             await page.reload({ waitUntil: 'networkidle' })
  35  |         }
  36  |     }
  37  | }
  38  | 
  39  | test.describe('booking UX regression', () => {
  40  |     test.describe.configure({ mode: 'serial' })
  41  | 
  42  |     test.beforeAll(async ({ request }) => {
  43  |         const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
> 44  |         expect(ownerLogin.ok()).toBeTruthy()
      |                                 ^ Error: expect(received).toBeTruthy()
  45  |         const carResponse = await request.post(`${apiBase}/cars`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
  46  |         expect(carResponse.status()).toBe(201)
  47  |         testCarId = (await carResponse.json()).data._id
  48  |         const userResponse = await request.post(`${apiBase}/auth/register`, { data: { name: 'E2E Booking User', email: testEmail, password: userPassword } })
  49  |         expect(userResponse.status()).toBe(201)
  50  |         testUserId = (await userResponse.json()).user.id
  51  |     })
  52  | 
  53  |     test.afterAll(async ({ request }) => {
  54  |         if (testBookingId) {
  55  |             const userLogin = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
  56  |             if (userLogin.ok()) await request.delete(`${apiBase}/bookings/${testBookingId}`)
  57  |         }
  58  |         const adminLogin = await request.post(`${apiBase}/auth/login`, { data: { email: 'admin@local.test', password: ownerPassword } })
  59  |         if (!adminLogin.ok()) return
  60  |         if (testCarId) await request.delete(`${apiBase}/cars/${testCarId}`)
  61  |         if (testUserId) await request.delete(`${apiBase}/admin/users/${testUserId}`)
  62  |     })
  63  | 
  64  |     test('Car Details loads booking fields', async ({ page }) => {
  65  |         await openCarDetails(page)
  66  |         await expect(page.getByText(testCarName)).toBeVisible()
  67  |         await expect(page.getByText('Pickup Date', { exact: true })).toBeVisible()
  68  |         await expect(page.getByText('Return Date', { exact: true })).toBeVisible()
  69  |         await expect(page.getByText('Rental days', { exact: true })).toBeVisible()
  70  |         await expect(page.getByText('Estimated total', { exact: true })).toBeVisible()
  71  |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeVisible()
  72  |     })
  73  | 
  74  |     test('unavailable car disables booking', async ({ page, request }) => {
  75  |         const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
  76  |         expect(ownerLogin.ok()).toBeTruthy()
  77  |         const update = await request.put(`${apiBase}/cars/${testCarId}`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: false } })
  78  |         expect(update.ok()).toBeTruthy()
  79  |         await openCarDetails(page)
  80  |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
  81  |         await request.put(`${apiBase}/cars/${testCarId}`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
  82  |     })
  83  | 
  84  |     test('invalid dates are rejected inline', async ({ page }) => {
  85  |         await loginThroughUi(page, testEmail, userPassword)
  86  |         await openCarDetails(page)
  87  |         await expect(page.getByText(testCarName)).toBeVisible()
  88  |         await page.getByLabel('Pickup location').fill('Chicago')
  89  |         await page.getByLabel('Pickup date').fill('2099-11-12')
  90  |         await page.getByLabel('Return date').fill('2099-11-10')
  91  |         await expect(page.getByText('Return date must be on or after pickup date')).toBeVisible()
  92  |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
  93  |     })
  94  | 
  95  |     test('authenticated user books and sees the created booking', async ({ page }) => {
  96  |         await loginThroughUi(page, testEmail, userPassword)
  97  |         await openCarDetails(page)
  98  |         await fillBookingDates(page)
  99  |         await expect(page.getByText('Rental days').locator('..')).toContainText('2')
  100 |         await expect(page.getByText('Estimated total').locator('..')).toContainText('$350')
  101 |         await page.getByRole('button', { name: 'Book Now' }).click()
  102 |         await expect(page).toHaveURL('/my-bookings', { timeout: 10000 })
  103 |         await expect(page.getByText(testCarName)).toBeVisible()
  104 |         await expect(page.getByText('$350')).toBeVisible()
  105 |         const bookingResponse = await page.request.get(`${apiBase}/bookings/my`)
  106 |         const bookingData = await bookingResponse.json()
  107 |         testBookingId = bookingData.data.find(booking => booking.car?._id === testCarId)?._id
  108 |         expect(testBookingId).toBeTruthy()
  109 |     })
  110 | 
  111 |     test('owner sees and updates the car booking status', async ({ page }) => {
  112 |         await loginThroughUi(page, ownerEmail, ownerPassword)
  113 |         await page.goto('/owner/manage-bookings')
  114 |         const bookingRow = page.getByTestId('booking-row').filter({ hasText: testCarName })
  115 |         await expect(bookingRow).toBeVisible()
  116 |         await expect(bookingRow).toContainText('E2E Booking User')
  117 |         await bookingRow.getByRole('button', { name: 'Confirm' }).click()
  118 |         await expect(page.getByText('Confirmed')).toBeVisible()
  119 |     })
  120 | 
  121 |     test('user cancels the eligible booking', async ({ page }) => {
  122 |         await loginThroughUi(page, testEmail, userPassword)
  123 |         await page.goto('/my-bookings')
  124 |         page.once('dialog', dialog => dialog.accept())
  125 |         await page.getByRole('button', { name: 'Cancel booking' }).click()
  126 |         await expect(page.getByText('Cancelled')).toBeVisible()
  127 |     })
  128 | 
  129 |     test('unauthenticated booking action goes to Login', async ({ page }) => {
  130 |         await openCarDetails(page)
  131 |         await fillBookingDates(page)
  132 |         await page.getByRole('button', { name: 'Log in to book' }).click()
  133 |         await expect(page).toHaveURL(/\/login$/)
  134 |     })
  135 | })
  136 | 
```