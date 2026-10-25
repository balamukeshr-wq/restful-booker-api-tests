import { test, expect } from '../fixtures/base';
import { buildBooking } from '../data/bookingData';

test.describe('Negative cases', () => {
    test('PUT without a token is rejected', { tag: '@regression' }, async ({ request, bookingClient, trackBooking }) => {
        const { bookingid } = await (await bookingClient.createBooking(buildBooking())).json();
        trackBooking(bookingid);

        const res = await request.put(`/booking/${bookingid}`, { data: buildBooking() });
        expect(res.status()).toBe(403);
    });

    test('DELETE without a token is rejected and the booking survives', { tag: '@regression' }, async ({ request, bookingClient, trackBooking }) => {
        const { bookingid } = await (await bookingClient.createBooking(buildBooking())).json();
        trackBooking(bookingid);

        expect((await request.delete(`/booking/${bookingid}`)).status()).toBe(403);
        expect((await bookingClient.getBooking(bookingid)).status()).toBe(200);
    });

    test('GET an unknown id returns 404', { tag: '@regression' }, async ({ bookingClient }) => {
        expect((await bookingClient.getBooking(999999999)).status()).toBe(404);
    });

    test('POST with a missing required field is rejected', { tag: '@regression' }, async ({ request }) => {
        const { firstname, ...incomplete } = buildBooking();
        const res = await request.post('/booking', { data: incomplete });
        expect(res.status()).toBe(500); // replace with what Postman showed
    });
});