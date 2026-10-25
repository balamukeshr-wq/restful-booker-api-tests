import { test, expect } from '../fixtures/base';
import { buildBooking } from '../data/bookingData';

test('create and read responses are JSON', { tag: '@regression' }, async ({ bookingClient, trackBooking }) => {
  const createRes = await bookingClient.createBooking(buildBooking());
  expect(createRes.headers()['content-type']).toContain('application/json');

  const { bookingid } = await createRes.json();
  trackBooking(bookingid);

  const readRes = await bookingClient.getBooking(bookingid);
  expect(readRes.headers()['content-type']).toContain('application/json');
});