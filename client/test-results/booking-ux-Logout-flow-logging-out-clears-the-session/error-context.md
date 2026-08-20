# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-ux.spec.js >> Logout flow >> logging out clears the session
- Location: tests\booking-ux.spec.js:241:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Login' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'Login' })

```

```yaml
- banner:
  - link "CarRental home":
    - /url: /
    - img "CarRental home"
  - navigation:
    - link "Browse cars":
      - /url: /cars
    - link "List your car":
      - /url: /owner/add-car
  - link "Login":
    - /url: /login
- main:
  - heading "Luxury Cars On Rent" [level=1]
  - combobox:
    - option "Pickup Location" [selected]
    - option "New York"
    - option "Los Angeles"
    - option "Houston"
    - option "Chicago"
  - paragraph: Please Select Location
  - text: Pickup-Date
  - textbox "Pickup-Date"
  - text: Return Date
  - textbox "Return Date"
  - button "search Search":
    - img "search"
    - text: Search
  - img "maincar"
  - heading "featured Vehicles" [level=1]
  - paragraph: Explore our selection of premium vehicles available for your next adventure.
  - img "E2E Suite Car 1787151960709 Regression"
  - paragraph: Available Now
  - text: $175/day
  - heading "E2E Suite Car 1787151960709 Regression" [level=3]
  - paragraph: Sedan 2025
  - text: 5 Seats Gasoline Automatic Chicago
  - img "BMW X5"
  - paragraph: Available Now
  - text: $300/day
  - heading "BMW X5" [level=3]
  - paragraph: SUV 2022
  - text: 5 Seats Hybrid Automatic New York
  - img "Toyota Corolla"
  - paragraph: Available Now
  - text: $130/day
  - heading "Toyota Corolla" [level=3]
  - paragraph: Sedan 2023
  - text: 5 Seats Gasoline Automatic Chicago
  - img "Toyota Corolla"
  - paragraph: Available Now
  - text: $130/day
  - heading "Toyota Corolla" [level=3]
  - paragraph: Sedan 2023
  - text: 5 Seats Gasoline Automatic Chicago
  - img "BMW X5"
  - paragraph: Available Now
  - text: $300/day
  - heading "BMW X5" [level=3]
  - paragraph: SUV 2022
  - text: 5 Seats Hybrid Automatic New York
  - button "Explore all cars arrow":
    - text: Explore all cars
    - img "arrow"
  - heading "Do You Own Luxury Car?" [level=2]
  - paragraph: Monetize your vehicle effortlessly by listing it on CarRental
  - paragraph: We take care of insurance, driver verification and secure payments - so you can earn passive income, stress-free.
  - link "List Your Car":
    - /url: /owner/add-car
  - img "car"
  - heading "What Our Customers Say" [level=1]
  - paragraph: Discover why discerning travelers choose StayVenture for their luxury accomodation around the world.
  - img "Biz.Eric"
  - paragraph: Biz.Eric
  - paragraph: New York, USA
  - img "star-icon"
  - img "star-icon"
  - img "star-icon"
  - img "star-icon"
  - img "star-icon"
  - paragraph: "\"CarRental made my trip so much easier.The car was delivered right to my door,and the customer service was fantastic!\""
  - img "Mush.Aline"
  - paragraph: Mush.Aline
  - paragraph: Barcelona, Spain
  - img "star-icon"
  - img "star-icon"
  - img "star-icon"
  - img "star-icon"
  - img "star-icon"
  - paragraph: "\"I've rented cars from various companies,but the experince with carRental was exceptional.\""
  - img "Muk.Esperance"
  - paragraph: Muk.Esperance
  - paragraph: Sydney, Australia
  - img "star-icon"
  - img "star-icon"
  - img "star-icon"
  - img "star-icon"
  - img "star-icon"
  - paragraph: "\"I higly recommend CarRental! Their fleet is amazing, and I always feel like i'm getting the best deal with excellent service\""
  - heading "Never Miss a Deal!" [level=1]
  - paragraph: Subscribe to get the latest offers, new arrivals, and exclusive discounts
  - textbox "Enter your email id"
  - button "Subscribe"
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
  150 |         await page.getByLabel('Pickup date').fill('2099-12-12')
  151 |         await page.getByLabel('Return date').fill('2099-12-10')
  152 |         await expect(page.getByText('Return date must be on or after pickup date')).toBeVisible()
  153 |         await expect(page.getByRole('button', { name: 'Book Now' })).toBeDisabled()
  154 |     })
  155 | 
  156 |     test('authenticated user books and sees the created booking', async ({ page }) => {
  157 |         await loginThroughUi(page, testEmail, userPassword)
  158 |         await openCarDetails(page)
  159 |         await fillBookingDates(page)
  160 |         await expect(page.getByText('Rental days').locator('..')).toContainText('2')
  161 |         await expect(page.getByText('Estimated total').locator('..')).toContainText('$350')
  162 |         await page.getByRole('button', { name: 'Book Now' }).click()
  163 |         await expect(page).toHaveURL('/my-bookings', { timeout: 10000 })
  164 |         await expect(page.getByText(testCarName)).toBeVisible()
  165 |         await expect(page.getByText('$350')).toBeVisible()
  166 |         const bookingResponse = await page.request.get(`${apiBase}/bookings/my`)
  167 |         const bookingData = await bookingResponse.json()
  168 |         testBookingId = bookingData.data.find(booking => booking.car?._id === testCarId)?._id
  169 |         expect(testBookingId).toBeTruthy()
  170 |     })
  171 | 
  172 |     test('overlapping bookings are rejected', async ({ request }) => {
  173 |         const userLogin = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
  174 |         expect(userLogin.ok()).toBeTruthy()
  175 |         const response = await request.post(`${apiBase}/bookings`, { data: { carId: testCarId, pickupLocation: 'Chicago', pickupDate: '2099-12-11', returnDate: '2099-12-13' } })
  176 |         expect(response.status()).toBe(409)
  177 |         const body = await response.json()
  178 |         expect(body.message).toMatch(/already booked|conflict/i)
  179 |     })
  180 | 
  181 |     test('owner sees and updates the car booking status', async ({ page }) => {
  182 |         await loginThroughUi(page, ownerEmail, ownerPassword)
  183 |         await page.goto('/owner/manage-bookings')
  184 |         const bookingRow = page.getByTestId('booking-row').filter({ hasText: testCarName })
  185 |         await expect(bookingRow).toBeVisible()
  186 |         await bookingRow.getByRole('button', { name: 'Confirm' }).click()
  187 |         await expect(page.getByText('Confirmed')).toBeVisible()
  188 |     })
  189 | 
  190 |     test('user cancels the eligible booking', async ({ page }) => {
  191 |         await loginThroughUi(page, testEmail, userPassword)
  192 |         await page.goto('/my-bookings')
  193 |         page.once('dialog', dialog => dialog.accept())
  194 |         await page.getByRole('button', { name: 'Cancel booking' }).click()
  195 |         await expect(page.getByText('Cancelled')).toBeVisible()
  196 |     })
  197 | 
  198 |     test('unauthenticated booking action goes to Login', async ({ page }) => {
  199 |         await openCarDetails(page)
  200 |         await fillBookingDates(page)
  201 |         await page.getByRole('button', { name: 'Log in to book' }).click()
  202 |         await expect(page).toHaveURL(/\/login$/)
  203 |     })
  204 | })
  205 | 
  206 | test.describe('Admin protection', () => {
  207 |     test('non-admin user cannot access admin dashboard', async ({ page }) => {
  208 |         await loginThroughUi(page, ownerEmail, ownerPassword)
  209 |         await page.goto('/admin')
  210 |         await expect(page).toHaveURL(/\/$/, { timeout: 5000 })
  211 |     })
  212 | 
  213 |     test('admin can access admin dashboard', async ({ page }) => {
  214 |         await loginThroughUi(page, adminEmail, ownerPassword)
  215 |         await page.goto('/admin')
  216 |         await expect(page.getByText('Admin Console')).toBeVisible()
  217 |     })
  218 | 
  219 |     test('admin can update a user role from the dashboard', async ({ page, request }) => {
  220 |         const roleEmail = `admin-role-${Date.now()}@test.local`
  221 |         const registerResponse = await request.post(`${apiBase}/auth/register`, { data: { name: 'Admin Role User', email: roleEmail, password: userPassword } })
  222 |         expect(registerResponse.status()).toBe(201)
  223 |         const { user: { id: userId } } = await registerResponse.json()
  224 | 
  225 |         await loginThroughUi(page, adminEmail, ownerPassword)
  226 |         await page.goto('/admin/users')
  227 | 
  228 |         const userRow = page.locator('[data-testid="admin-user-row"]', { hasText: 'Admin Role User' })
  229 |         await expect(userRow).toBeVisible({ timeout: 10000 })
  230 |         await userRow.locator('select').selectOption('owner')
  231 |         await userRow.getByRole('button', { name: 'Save role' }).click()
  232 |         await expect(userRow).toContainText('Owner')
  233 | 
  234 |         await request.delete(`${apiBase}/admin/users/${userId}`)
  235 |     })
  236 | })
  237 | 
  238 | test.describe('Logout flow', () => {
  239 |     const logoutEmail = `e2e-logout-${Date.now()}@test.local`
  240 | 
  241 |     test('logging out clears the session', async ({ page }) => {
  242 |         await page.goto('/signup')
  243 |         await page.getByPlaceholder('Full name').fill('Logout Test User')
  244 |         await page.getByPlaceholder('Email address').fill(logoutEmail)
  245 |         await page.getByPlaceholder('Password (6+ characters)').fill(userPassword)
  246 |         await page.getByRole('button', { name: 'Create account' }).click()
  247 |         await expect(page).toHaveURL(/\/$/, { timeout: 10000 })
  248 |         await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
  249 |         await page.getByRole('button', { name: 'Logout' }).click()
> 250 |         await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
      |                                                                   ^ Error: expect(locator).toBeVisible() failed
  251 |         await page.goto('/my-bookings')
  252 |         await expect(page).toHaveURL(/\/login$/)
  253 |     })
  254 | })
  255 | 
```