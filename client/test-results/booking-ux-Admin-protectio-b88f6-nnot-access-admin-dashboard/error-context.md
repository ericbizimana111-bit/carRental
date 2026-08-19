# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-ux.spec.js >> Admin protection >> non-admin user cannot access admin dashboard
- Location: tests\booking-ux.spec.js:211:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/$/
Received string:  "http://localhost:5173/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:5173/login"

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
  - heading "Welcome back" [level=1]
  - paragraph: Log in to manage bookings and reservations.
  - textbox "Email address": owner@local.test
  - textbox "Password": AuditPass123!
  - paragraph: Unable to log in
  - button "Log in"
  - paragraph:
    - text: New here?
    - link "Create an account":
      - /url: /signup
  - link "Forgot password?":
    - /url: /forgot-password
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
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | const apiBase = process.env.API_URL || 'http://localhost:5000/api'
  4   | const ownerEmail = process.env.E2E_OWNER_EMAIL || 'owner@local.test'
  5   | const ownerPassword = process.env.E2E_OWNER_PASSWORD || 'AuditPass123!'
  6   | const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@local.test'
  7   | const userPassword = process.env.E2E_USER_PASSWORD || 'BrowserTestPass123!'
  8   | const testEmail = `e2e-suite-${Date.now()}@test.local`
  9   | const testCarName = `E2E Suite Car ${Date.now()}`
  10  | 
  11  | let testUserId
  12  | let testCarId
  13  | let testBookingId
  14  | 
  15  | const loginThroughUi = async (page, email, password) => {
  16  |     await page.goto('/login')
  17  |     await page.getByPlaceholder('Email address').fill(email)
  18  |     await page.getByPlaceholder('Password').fill(password)
  19  |     await page.getByRole('button', { name: 'Log in' }).click()
> 20  |     await expect(page).toHaveURL(/\/$/)
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  21  | }
  22  | 
  23  | const loginAsOwner = async (page) => {
  24  |     await loginThroughUi(page, ownerEmail, ownerPassword)
  25  | }
  26  | 
  27  | const fillBookingDates = async (page) => {
  28  |     await page.getByLabel('Pickup location').fill('Chicago')
  29  |     await page.getByLabel('Pickup date').fill('2099-12-10')
  30  |     await page.getByLabel('Return date').fill('2099-12-12')
  31  | }
  32  | 
  33  | const openCarDetails = async (page) => {
  34  |     for (let attempt = 0; attempt < 3; attempt += 1) {
  35  |         await page.goto(`/car-details/${testCarId}`)
  36  |         try {
  37  |             await expect(page.getByLabel('Pickup location')).toBeVisible({ timeout: 5000 })
  38  |             return
  39  |         } catch (error) {
  40  |             if (attempt === 2) throw error
  41  |             await page.reload({ waitUntil: 'networkidle' })
  42  |         }
  43  |     }
  44  | }
  45  | 
  46  | test.describe('Home page', () => {
  47  |     test('loads and displays hero section with featured vehicles', async ({ page }) => {
  48  |         await page.goto('/')
  49  |         await expect(page.getByRole('heading', { name: 'Luxury Cars On Rent' })).toBeVisible()
  50  |         await expect(page.getByText('featured Vehicles', { exact: false })).toBeVisible()
  51  |         await expect(page.getByRole('button', { name: 'Search' })).toBeVisible()
  52  |     })
  53  | })
  54  | 
  55  | test.describe('Cars page', () => {
  56  |     test('loads and displays available cars', async ({ page }) => {
  57  |         await page.goto('/cars')
  58  |         await expect(page.getByText('Available Cars')).toBeVisible()
  59  |         await expect(page.getByText('Showing')).toBeVisible()
  60  |     })
  61  | })
  62  | 
  63  | test.describe('Signup flow', () => {
  64  |     test('creates a new account and logs in', async ({ page }) => {
  65  |         await page.goto('/signup')
  66  |         await expect(page.getByText('Create your account')).toBeVisible()
  67  |         await page.getByPlaceholder('Full name').fill('E2E Signup User')
  68  |         await page.getByPlaceholder('Email address').fill(`e2e-signup-${Date.now()}@test.local`)
  69  |         await page.getByPlaceholder('Password (6+ characters)').fill(userPassword)
  70  |         await page.getByRole('button', { name: 'Create account' }).click()
  71  |         await expect(page).toHaveURL(/\/$/, { timeout: 10000 })
  72  |     })
  73  | 
  74  |     test('rejects duplicate email', async ({ page }) => {
  75  |         await page.goto('/signup')
  76  |         await page.getByPlaceholder('Full name').fill('Duplicate User')
  77  |         await page.getByPlaceholder('Email address').fill(testEmail)
  78  |         await page.getByPlaceholder('Password (6+ characters)').fill(userPassword)
  79  |         await page.getByRole('button', { name: 'Create account' }).click()
  80  |         await expect(page.getByText('already registered', { exact: false })).toBeVisible({ timeout: 5000 })
  81  |     })
  82  | })
  83  | 
  84  | test.describe('Login flow', () => {
  85  |     test('logs in with valid credentials', async ({ page }) => {
  86  |         await loginThroughUi(page, ownerEmail, ownerPassword)
  87  |     })
  88  | 
  89  |     test('rejects invalid credentials', async ({ page }) => {
  90  |         await page.goto('/login')
  91  |         await page.getByPlaceholder('Email address').fill('nonexistent@test.local')
  92  |         await page.getByPlaceholder('Password').fill('wrongpassword')
  93  |         await page.getByRole('button', { name: 'Log in' }).click()
  94  |         await expect(page.getByText('Invalid email or password')).toBeVisible()
  95  |     })
  96  | })
  97  | 
  98  | test.describe('booking UX regression', () => {
  99  |     test.describe.configure({ mode: 'serial' })
  100 | 
  101 |     test.beforeAll(async ({ request }) => {
  102 |         const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
  103 |         expect(ownerLogin.ok()).toBeTruthy()
  104 |         const carResponse = await request.post(`${apiBase}/cars`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
  105 |         expect(carResponse.status()).toBe(201)
  106 |         testCarId = (await carResponse.json()).data._id
  107 |         let userResponse = await request.post(`${apiBase}/auth/register`, { data: { name: 'E2E Booking User', email: testEmail, password: userPassword } })
  108 |         if (userResponse.status() === 409) {
  109 |             userResponse = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
  110 |             expect(userResponse.ok()).toBeTruthy()
  111 |             testUserId = (await userResponse.json()).user.id
  112 |         } else {
  113 |             expect(userResponse.status()).toBe(201)
  114 |             testUserId = (await userResponse.json()).user.id
  115 |         }
  116 |     })
  117 | 
  118 |     test.afterAll(async ({ request }) => {
  119 |         if (testBookingId) {
  120 |             const userLogin = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
```