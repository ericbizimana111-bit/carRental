import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    fullyParallel: false,
    workers: 1,
    reporter: 'list',
    use: {
        baseURL: process.env.FRONTEND_URL || 'http://localhost:5173',
        headless: true,
        trace: 'retain-on-failure'
    }
})
