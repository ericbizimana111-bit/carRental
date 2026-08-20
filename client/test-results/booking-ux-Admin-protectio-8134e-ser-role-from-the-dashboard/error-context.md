# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-ux.spec.js >> Admin protection >> admin can update a user role from the dashboard
- Location: tests\booking-ux.spec.js:219:5

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
  - heading "Welcome back" [level=1]
  - paragraph: Log in to manage bookings and reservations.
  - textbox "Email address": admin@local.test
  - textbox "Password": AuditPass123!
  - paragraph: Invalid email or password
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
  23  | const fillBookingDates = async (page) => {
  24  |     await page.getByLabel('Pickup location').fill('Chicago')
  25  |     await page.getByLabel('Pickup date').fill('2099-12-10')
  26  |     await page.getByLabel('Return date').fill('2099-12-12')
  27  | }
  28  | 
  29  | const openCarDetails = async (page) => {
  30  |     for (let attempt = 0; attempt < 3; attempt += 1) {
  31  |         await page.goto(`/car-details/${testCarId}`)
  32  |         try {
  33  |             await expect(page.getByLabel('Pickup location')).toBeVisible({ timeout: 5000 })
  34  |             return
  35  |         } catch (error) {
  36  |             if (attempt === 2) throw error
  37  |             await page.reload({ waitUntil: 'networkidle' })
  38  |         }
  39  |     }
  40  | }
  41  | 
  42  | test.describe('Home page', () => {
  43  |     test('loads and displays hero section with featured vehicles', async ({ page }) => {
  44  |         await page.goto('/')
  45  |         await expect(page.getByRole('heading', { name: 'Luxury Cars On Rent' })).toBeVisible()
  46  |         await expect(page.getByText('featured Vehicles', { exact: false })).toBeVisible()
  47  |         await expect(page.getByRole('button', { name: 'Search' })).toBeVisible()
  48  |     })
  49  | })
  50  | 
  51  | test.describe('Cars page', () => {
  52  |     test('loads and displays available cars', async ({ page }) => {
  53  |         await page.goto('/cars')
  54  |         await expect(page.getByText('Available Cars')).toBeVisible()
  55  |         await expect(page.getByText('Showing')).toBeVisible()
  56  |     })
  57  | })
  58  | 
  59  | test.describe('Signup flow', () => {
  60  |     test('creates a new account and logs in', async ({ page }) => {
  61  |         await page.goto('/signup')
  62  |         await expect(page.getByText('Create your account')).toBeVisible()
  63  |         await page.getByPlaceholder('Full name').fill('E2E Signup User')
  64  |         await page.getByPlaceholder('Email address').fill(`e2e-signup-${Date.now()}@test.local`)
  65  |         await page.getByPlaceholder('Password (6+ characters)').fill(userPassword)
  66  |         await page.getByRole('button', { name: 'Create account' }).click()
  67  |         await expect(page).toHaveURL(/\/$/, { timeout: 10000 })
  68  |     })
  69  | 
  70  |     test('rejects duplicate email', async ({ page }) => {
  71  |         await page.goto('/signup')
  72  |         await page.getByPlaceholder('Full name').fill('Duplicate User')
  73  |         await page.getByPlaceholder('Email address').fill(testEmail)
  74  |         await page.getByPlaceholder('Password (6+ characters)').fill(userPassword)
  75  |         await page.getByRole('button', { name: 'Create account' }).click()
  76  |         await expect(page.getByText('already registered', { exact: false })).toBeVisible({ timeout: 5000 })
  77  |     })
  78  | })
  79  | 
  80  | test.describe('Login flow', () => {
  81  |     test('logs in with valid credentials', async ({ page }) => {
  82  |         await loginThroughUi(page, ownerEmail, ownerPassword)
  83  |     })
  84  | 
  85  |     test('rejects invalid credentials', async ({ page }) => {
  86  |         await page.goto('/login')
  87  |         await page.getByPlaceholder('Email address').fill('nonexistent@test.local')
  88  |         await page.getByPlaceholder('Password').fill('wrongpassword')
  89  |         await page.getByRole('button', { name: 'Log in' }).click()
  90  |         await expect(page.getByText('Invalid email or password')).toBeVisible()
  91  |     })
  92  | })
  93  | 
  94  | test.describe('booking UX regression', () => {
  95  |     test.describe.configure({ mode: 'serial' })
  96  | 
  97  |     test.beforeAll(async ({ request }) => {
  98  |         const ownerLogin = await request.post(`${apiBase}/auth/login`, { data: { email: ownerEmail, password: ownerPassword } })
  99  |         expect(ownerLogin.ok()).toBeTruthy()
  100 |         const carResponse = await request.post(`${apiBase}/cars`, { data: { brand: testCarName, model: 'Regression', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', year: 2025, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 175, location: 'Chicago', description: 'Dedicated browser regression vehicle.', isAvailable: true } })
  101 |         expect(carResponse.status()).toBe(201)
  102 |         testCarId = (await carResponse.json()).data._id
  103 |         let userResponse = await request.post(`${apiBase}/auth/register`, { data: { name: 'E2E Booking User', email: testEmail, password: userPassword } })
  104 |         if (userResponse.status() === 409) {
  105 |             userResponse = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
  106 |             expect(userResponse.ok()).toBeTruthy()
  107 |             testUserId = (await userResponse.json()).user.id
  108 |         } else {
  109 |             expect(userResponse.status()).toBe(201)
  110 |             testUserId = (await userResponse.json()).user.id
  111 |         }
  112 |     })
  113 | 
  114 |     test.afterAll(async ({ request }) => {
  115 |         if (testBookingId) {
  116 |             const userLogin = await request.post(`${apiBase}/auth/login`, { data: { email: testEmail, password: userPassword } })
  117 |             if (userLogin.ok()) await request.delete(`${apiBase}/bookings/${testBookingId}`)
  118 |         }
  119 |         const adminLogin = await request.post(`${apiBase}/auth/login`, { data: { email: adminEmail, password: ownerPassword } })
  120 |         if (!adminLogin.ok()) return
```