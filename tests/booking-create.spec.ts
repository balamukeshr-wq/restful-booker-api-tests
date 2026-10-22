import { test, expect } from '../fixtures/base';
import { buildBooking } from '../data/bookingData';

test.describe('Create Booking Integration Suite', () => {
    const createdIds: number[] = [];

    // Manual cleanup step for Day 4 to remove generated records
    test.afterEach(async ({ bookingClient }) => {
        for (const id of createdIds) {
            await bookingClient.deleteBooking(id);
        }
        createdIds.length = 0;
    });

    test('POST /booking should successfully instantiate a new reservation record', { tag: '@smoke' }, async ({ bookingClient }) => {
        const payload = buildBooking();

        // Action - Send the creation request
        const response = await bookingClient.createBooking(payload);
        expect(response.status()).toBe(200);

        // Deserialization of response text string back into a working object
        const body = await response.json();
        expect(body.bookingid).toBeDefined();
        expect(typeof body.bookingid).toBe('number');

        // Save the ID so the afterEach hook can clean it up later
        createdIds.push(body.bookingid);

        // Verify that the saved record values match the details we sent
        expect(body.booking).toMatchObject({
            firstname: payload.firstname,
            lastname: payload.lastname,
            totalprice: payload.totalprice,
            depositpaid: payload.depositpaid,
        });
    });
});
