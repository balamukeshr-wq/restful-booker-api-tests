import { test, expect } from '../fixtures/base';
import { buildBooking } from '../data/bookingData';

test.describe('Read Booking ', () => {
    const createdIds: number[] = [];

    test.afterEach(async ({ bookingClient}) => {
        for (const id of createdIds) {
            await bookingClient.deleteBooking(id);
        }
        createdIds.length = 0;
    });

    test('GET /booking/{id} returns the booking created', { tag: '@smoke' }, async ({ bookingClient }) => {
        const payload = buildBooking();

        // 1. Setup - Create a fresh record isolated to this test
        const createResponse = await bookingClient.createBooking(payload);
        const createBody = await createResponse.json();
        const targetId = createBody.bookingid;
        createdIds.push(targetId);

        // 2. Action - Attempt to look up the booking by its ID
        const readResponse = await bookingClient.getBooking(targetId);
        expect(readResponse.status()).toBe(200);

        // 3. Assertion - Validate the unboxed data matches our initial payload perfectly
        const readBody = await readResponse.json();
        expect(readBody).toMatchObject({ ...payload });
    });
});
