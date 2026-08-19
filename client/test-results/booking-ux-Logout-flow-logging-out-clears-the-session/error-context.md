# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-ux.spec.js >> Logout flow >> logging out clears the session
- Location: tests\booking-ux.spec.js:227:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/$/
Received string:  "http://localhost:5173/signup"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:5173/signup"

```

```yaml
- link "logo":
  - /url: /
  - img "logo"
- link "Home":
  - /url: /
- link "Cars":
  - /url: /cars
- link "My Bookings":
  - /url: /my-bookings
- link "Favorites":
  - /url: /favorites
- textbox "Searh Products"
- img "search"
- button "Login"
- main:
  - heading "Create your account" [level=1]
  - textbox "Full name": Logout Test User
  - textbox "Email address": e2e-logout-1787152011357@test.local
  - textbox "Password (6+ characters)": BrowserTestPass123!
  - paragraph: Unable to create account
  - button "Create account"
  - paragraph:
    - text: Already registered?
    - link "Log in":
      - /url: /login
- img "logo"
- paragraph: Premium Car rental service with a wide selection of luxury and everyday vehicles for all your driving needs.
- link:
  - /url: "#"
- link:
  - /url: "#"
- link:
  - /url: "#"
- link:
  - /url: "#"
- paragraph: Quick Links
- list:
  - listitem:
    - link "Home":
      - /url: "#"
  - listitem:
    - link "Browse Cars":
      - /url: "#"
  - listitem:
    - link "List Your Car":
      - /url: "#"
  - listitem:
    - link "About Us":
      - /url: "#"
- heading "Contact" [level=2]
- list:
  - listitem: 1234 Luxury Drive
  - listitem: San Francisco, CA 94107
  - listitem: "0799887886"
  - listitem: info@example.com
- heading "Resources" [level=2]
- list:
  - listitem:
    - link "Help Center":
      - /url: "#"
  - listitem:
    - link "Terms of Service":
      - /url: "#"
  - listitem:
    - link "Privacy Policy":
      - /url: "#"
  - listitem:
    - link "Insurance":
      - /url: "#"
- paragraph: © 2026 Brand. All rights reserved.
- list:
  - listitem:
    - link "Privacy":
      - /url: "#"
    - text: "|"
  - listitem: "|"
  - listitem:
    - link "Terms":
      - /url: "#"
    - text: "|"
  - listitem: "|"
  - listitem:
    - link "Cookie":
      - /url: "#"
    - text: "|"
```

# Test source

```ts
  133 |         await expect(page.getByText('Return Date', { exact: true })).toBeVisible()
  134 |         await expect(page.getByText('Rental days', { exact: true })).toBeVisible()
  135 |         await expect(page.getByText('Estimated total', { exact: true })).toBeVisible()
  136 |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeVisible()
  137 |     })
  138 | 
  139 |     test('unavailable car disables booking', async ({ page, request }) => {
  140 |         const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
  141 |         expect(ownerLogin.ok()).toBeTruthy()
  142 |         const update = await request.put(`${apiBase}/cars/${testCarId}`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: false } })
  143 |         expect(update.ok()).toBeTruthy()
  144 |         await openCarDetails(page)
  145 |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
  146 |         await request.put(`${apiBase}/cars/${testCarId}`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
  147 |     })
  148 | 
  149 |     test('invalid dates are rejected inline', async ({ page }) => {
  150 |         await loginThroughUi(page, testEmail, userPassword)
  151 |         await openCarDetails(page)
  152 |         await expect(page.getByText(testCarName)).toBeVisible()
  153 |         await page.getByLabel('Pickup location').fill('Chicago')
  154 |         await page.getByLabel('Pickup date').fill('2099-12-12')
  155 |         await page.getByLabel('Return date').fill('2099-12-10')
  156 |         await expect(page.getByText('Return date must be on or after pickup date')).toBeVisible()
  157 |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
  158 |     })
  159 | 
  160 |     test('authenticated user books and sees the created booking', async ({ page }) => {
  161 |         await loginThroughUi(page, testEmail, userPassword)
  162 |         await openCarDetails(page)
  163 |         await fillBookingDates(page)
  164 |         await expect(page.getByText('Rental days').locator('..')).toContainText('2')
  165 |         await expect(page.getByText('Estimated total').locator('..')).toContainText('$350')
  166 |         await page.getByRole('button', { name: 'Book Now' }).click()
  167 |         await expect(page).toHaveURL('/my-bookings', { timeout: 10000 })
  168 |         await expect(page.getByText(testCarName)).toBeVisible()
  169 |         await expect(page.getByText('$350')).toBeVisible()
  170 |         const bookingResponse = await page.request.get(`${apiBase}/bookings/my`)
  171 |         const bookingData = await bookingResponse.json()
  172 |         testBookingId = bookingData.data.find(booking => booking.car?._id === testCarId)?._id
  173 |         expect(testBookingId).toBeTruthy()
  174 |     })
  175 | 
  176 |     test('overlapping bookings are rejected', async ({ page, request }) => {
  177 |         const userLogin = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
  178 |         expect(userLogin.ok()).toBeTruthy()
  179 |         const response = await request.post(`${apiBase}/bookings`, { data: { carId: testCarId, pickupLocation: 'Chicago', pickupDate: '2099-12-11', returnDate: '2099-12-13' } })
  180 |         expect(response.status()).toBe(409)
  181 |         const body = await response.json()
  182 |         expect(body.message).toMatch(/already booked|conflict/i)
  183 |     })
  184 | 
  185 |     test('owner sees and updates the car booking status', async ({ page }) => {
  186 |         await loginThroughUi(page, ownerEmail, ownerPassword)
  187 |         await page.goto('/owner/manage-bookings')
  188 |         const bookingRow = page.getByTestId('booking-row').filter({ hasText: testCarName })
  189 |         await expect(bookingRow).toBeVisible()
  190 |         await bookingRow.getByRole('button', { name: 'Confirm' }).click()
  191 |         await expect(page.getByText('Confirmed')).toBeVisible()
  192 |     })
  193 | 
  194 |     test('user cancels the eligible booking', async ({ page }) => {
  195 |         await loginThroughUi(page, testEmail, userPassword)
  196 |         await page.goto('/my-bookings')
  197 |         page.once('dialog', dialog => dialog.accept())
  198 |         await page.getByRole('button', { name: 'Cancel booking' }).click()
  199 |         await expect(page.getByText('Cancelled')).toBeVisible()
  200 |     })
  201 | 
  202 |     test('unauthenticated booking action goes to Login', async ({ page }) => {
  203 |         await openCarDetails(page)
  204 |         await fillBookingDates(page)
  205 |         await page.getByRole('button', { name: 'Log in to book' }).click()
  206 |         await expect(page).toHaveURL(/\/login$/)
  207 |     })
  208 | })
  209 | 
  210 | test.describe('Admin protection', () => {
  211 |     test('non-admin user cannot access admin dashboard', async ({ page }) => {
  212 |         await loginThroughUi(page, ownerEmail, ownerPassword)
  213 |         await page.goto('/admin')
  214 |         await expect(page).toHaveURL(/\/$/, { timeout: 5000 })
  215 |     })
  216 | 
  217 |     test('admin can access admin dashboard', async ({ page }) => {
  218 |         await loginThroughUi(page, adminEmail, ownerPassword)
  219 |         await page.goto('/admin')
  220 |         await expect(page.getByText('Admin Console')).toBeVisible()
  221 |     })
  222 | })
  223 | 
  224 | test.describe('Logout flow', () => {
  225 |     const logoutEmail = `e2e-logout-${Date.now()}@test.local`
  226 | 
  227 |     test('logging out clears the session', async ({ page }) => {
  228 |         await page.goto('/signup')
  229 |         await page.getByPlaceholder('Full name').fill('Logout Test User')
  230 |         await page.getByPlaceholder('Email address').fill(logoutEmail)
  231 |         await page.getByPlaceholder('Password (6+ characters)').fill(userPassword)
  232 |         await page.getByRole('button', { name: 'Create account' }).click()
> 233 |         await expect(page).toHaveURL(/\/$/, { timeout: 10000 })
      |                            ^ Error: expect(page).toHaveURL(expected) failed
  234 |         await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
  235 |         await page.getByRole('button', { name: 'Logout' }).click()
  236 |         await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  237 |         await page.goto('/my-bookings')
  238 |         await expect(page).toHaveURL(/\/login$/)
  239 |     })
  240 | })
  241 | 
```