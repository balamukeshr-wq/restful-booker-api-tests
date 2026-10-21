import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    timeout: 60_000,
    reporter: [['list'], ['html', { open: 'never' }]],

    use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        trace: 'retain-on-failure',
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    },
});
