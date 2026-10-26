import { test, expect } from "../fixtures/base";

test.describe('Authentication Tests via Client Wrapper', () => {

  test('Valid login returns a token', { tag: '@smoke' }, async ({ bookingClient }) => {
    const response = await bookingClient.getToken('admin', 'password123');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(typeof body.token).toBe('string');
  });

  test('Invalid login is rejected with "Bad credentials"', { tag: '@smoke' }, async ({ bookingClient }) => {
    const response = await bookingClient.getToken('wrongUser', 'wrongPass');
    expect(response.status()).toBe(200); // Known endpoint quirk from Day 1

    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });
});
