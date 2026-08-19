# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-ux.spec.js >> booking UX regression >> owner sees and updates the car booking status
- Location: tests\booking-ux.spec.js:113:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('booking-row').filter({ hasText: 'E2E Test Car 1787147616860' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('booking-row').filter({ hasText: 'E2E Test Car 1787147616860' })

```

# Test source

```ts
  17  |     await page.getByPlaceholder('Email address').fill(email)
  18  |     await page.getByPlaceholder('Password').fill(password)
  19  |     await page.getByRole('button', { name: 'Log in' }).click()
  20  |     await expect(page).toHaveURL(/\/$/)
  21  | }
  22  | 
  23  | const fillBookingDates = async page => {
  24  |     await page.getByLabel('Pickup location').fill('Chicago')
  25  |     await page.getByLabel('Pickup date').fill('2099-11-10')
  26  |     await page.getByLabel('Return date').fill('2099-11-12')
  27  | }
  28  | const openCarDetails = async page => {
  29  |     for (let attempt = 0; attempt < 3; attempt += 1) {
  30  |         await page.goto(`/car-details/${testCarId}`)
  31  |         try {
  32  |             await expect(page.getByLabel('Pickup location')).toBeVisible({ timeout: 4000 })
  33  |             return
  34  |         } catch (error) {
  35  |             if (attempt === 2) throw error
  36  |             await page.reload({ waitUntil: 'networkidle' })
  37  |         }
  38  |     }
  39  | }
  40  | 
  41  | test.describe('booking UX regression', () => {
  42  |     test.describe.configure({ mode: 'serial' })
  43  | 
  44  |     test.beforeAll(async ({ request }) => {
  45  |         const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
  46  |         expect(ownerLogin.ok()).toBeTruthy()
  47  |         const carResponse = await request.post(`${apiBase}/cars`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
  48  |         expect(carResponse.status()).toBe(201)
  49  |         testCarId = (await carResponse.json()).data._id
  50  |         const userResponse = await request.post(`${apiBase}/auth/register`, { data: { name: 'E2E Booking User', email: testEmail, password: userPassword } })
  51  |         expect(userResponse.status()).toBe(201)
  52  |         testUserId = (await userResponse.json()).user.id
  53  |     })
  54  | 
  55  |     test.afterAll(async ({ request }) => {
  56  |         if (testBookingId) {
  57  |             const userLogin = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
  58  |             if (userLogin.ok()) await request.delete(`${apiBase}/bookings/${testBookingId}`)
  59  |         }
  60  |         const adminLogin = await request.post(`${apiBase}/auth/login`, { data: { email: 'admin@local.test', password: ownerPassword } })
  61  |         if (!adminLogin.ok()) return
  62  |         if (testCarId) await request.delete(`${apiBase}/cars/${testCarId}`)
  63  |         if (testUserId) await request.delete(`${apiBase}/admin/users/${testUserId}`)
  64  |     })
  65  | 
  66  |     test('Car Details loads booking fields', async ({ page }) => {
  67  |         await openCarDetails(page)
  68  |         await expect(page.getByText(testCarName)).toBeVisible()
  69  |         await expect(page.getByText('Pickup Date', { exact: true })).toBeVisible()
  70  |         await expect(page.getByText('Return Date', { exact: true })).toBeVisible()
  71  |         await expect(page.getByText('Rental days', { exact: true })).toBeVisible()
  72  |         await expect(page.getByText('Estimated total', { exact: true })).toBeVisible()
  73  |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeVisible()
  74  |     })
  75  | 
  76  |     test('unavailable car disables booking', async ({ page, request }) => {
  77  |         const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
  78  |         expect(ownerLogin.ok()).toBeTruthy()
  79  |         const update = await request.put(`${apiBase}/cars/${testCarId}`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: false } })
  80  |         expect(update.ok()).toBeTruthy()
  81  |         await openCarDetails(page)
  82  |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
  83  |         await request.put(`${apiBase}/cars/${testCarId}`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
  84  |     })
  85  | 
  86  |     test('invalid dates are rejected inline', async ({ page }) => {
  87  |         await loginThroughUi(page, testEmail, userPassword)
  88  |         await openCarDetails(page)
  89  |         await expect(page.getByText(testCarName)).toBeVisible()
  90  |         await page.getByLabel('Pickup location').fill('Chicago')
  91  |         await page.getByLabel('Pickup date').fill('2099-11-12')
  92  |         await page.getByLabel('Return date').fill('2099-11-10')
  93  |         await expect(page.getByText('Return date must be on or after pickup date')).toBeVisible()
  94  |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
  95  |     })
  96  | 
  97  |     test('authenticated user books and sees the created booking', async ({ page }) => {
  98  |         await loginThroughUi(page, testEmail, userPassword)
  99  |         await openCarDetails(page)
  100 |         await fillBookingDates(page)
  101 |         await expect(page.getByText('Rental days').locator('..')).toContainText('2')
  102 |         await expect(page.getByText('Estimated total').locator('..')).toContainText('$350')
  103 |         await page.getByRole('button', { name: 'Book Now' }).click()
  104 |         await expect(page).toHaveURL('/my-bookings', { timeout: 10000 })
  105 |         await expect(page.getByText(testCarName)).toBeVisible()
  106 |         await expect(page.getByText('$350')).toBeVisible()
  107 |         const bookingResponse = await page.request.get(`${apiBase}/bookings/my`)
  108 |         const bookingData = await bookingResponse.json()
  109 |         testBookingId = bookingData.data.find(booking => booking.car?._id === testCarId)?._id
  110 |         expect(testBookingId).toBeTruthy()
  111 |     })
  112 | 
  113 |     test('owner sees and updates the car booking status', async ({ page }) => {
  114 |         await loginThroughUi(page, ownerEmail, ownerPassword)
  115 |         await page.goto('/owner/manage-bookings')
  116 |         const bookingRow = page.getByTestId('booking-row').filter({ hasText: testCarName })
> 117 |         await expect(bookingRow).toBeVisible()
      |                                  ^ Error: expect(locator).toBeVisible() failed
  118 |         await expect(bookingRow).toContainText('E2E Booking User')
  119 |         await bookingRow.getByRole('button', { name: 'Confirm' }).click()
  120 |         await expect(page.getByText('Confirmed')).toBeVisible()
  121 |     })
  122 | 
  123 |     test('user cancels the eligible booking', async ({ page }) => {
  124 |         await loginThroughUi(page, testEmail, userPassword)
  125 |         await page.goto('/my-bookings')
  126 |         page.once('dialog', dialog => dialog.accept())
  127 |         await page.getByRole('button', { name: 'Cancel booking' }).click()
  128 |         await expect(page.getByText('Cancelled')).toBeVisible()
  129 |     })
  130 | 
  131 |     test('unauthenticated booking action goes to Login', async ({ page }) => {
  132 |         await openCarDetails(page)
  133 |         await fillBookingDates(page)
  134 |         await page.getByRole('button', { name: 'Log in to book' }).click()
  135 |         await expect(page).toHaveURL(/\/login$/)
  136 |     })
  137 | })
  138 | 
```