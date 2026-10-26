import { test, expect } from '@playwright/test';

test('GET /ping responds with 201 Created', { tag: '@smoke' }, async ({ request }) => {
  const response = await request.get('/ping');

  // Asserting the status code recorded from Day 1
  expect(response.status()).toBe(201);
});
