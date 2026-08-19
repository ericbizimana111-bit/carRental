import assert from 'node:assert/strict'
import { test, after } from 'node:test'

const baseUrl = process.env.API_URL || 'http://localhost:5000/api'
const password = process.env.SMOKE_PASSWORD
const email = `smoke-${Date.now()}@test.local`
let cookie = ''

if (!password || password.length < 6) throw new Error('SMOKE_PASSWORD with at least 6 characters is required')

const request = async (path, options = {}) => {
    const headers = { ...(options.body ? { 'content-type': 'application/json' } : {}), ...(cookie ? { cookie } : {}) }
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers })
    const setCookies = response.headers.getSetCookie?.() || []
    if (setCookies.length) cookie = setCookies.map(value => value.split(';', 1)[0]).join('; ')
    const body = await response.json().catch(() => ({}))
    return { response, body }
}

const body = value => ({ method: 'POST', body: JSON.stringify(value) })

test('health endpoint is available', async () => {
    const { response, body: result } = await request('/health')
    assert.equal(response.status, 200)
    assert.equal(result.success, true)
})

test('signup creates a session', async () => {
    const { response, body: result } = await request('/auth/register', body({ name: 'Runtime Smoke', email, password }))
    assert.equal(response.status, 201)
    assert.equal(result.user.email, email)
    assert.match(cookie, /token=/)
})

test('duplicate email is rejected', async () => {
    const { response } = await request('/auth/register', body({ name: 'Duplicate', email, password }))
    assert.equal(response.status, 409)
})

test('current user works with the session cookie', async () => {
    const { response, body: result } = await request('/auth/me')
    assert.equal(response.status, 200)
    assert.equal(result.user.email, email)
})

test('public cars endpoint returns pagination metadata', async () => {
    const { response, body: result } = await request('/cars?page=1&limit=2')
    assert.equal(response.status, 200)
    assert.ok(Array.isArray(result.data))
    assert.equal(result.pagination.page, 1)
})

test('normal users cannot create cars', async () => {
    const { response } = await request('/cars', body({ brand: 'Blocked', model: 'Smoke', image: 'https://example.com/car.jpg', year: 2024, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 10, location: 'Test', description: 'Blocked' }))
    assert.equal(response.status, 403)
})

test('favorites require authentication', async () => {
    const savedCookie = cookie
    cookie = ''
    const { response } = await request('/favorites')
    cookie = savedCookie
    assert.equal(response.status, 401)
})

test('logout invalidates the session', async () => {
    const { response } = await request('/auth/logout', { method: 'POST' })
    assert.equal(response.status, 200)
    const current = await request('/auth/me')
    assert.equal(current.response.status, 401)
})

after(() => { cookie = '' })
