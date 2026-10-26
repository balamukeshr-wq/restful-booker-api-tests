import { test } from '../fixtures/base';
import { expect } from '@playwright/test';

test.describe('Booking Update Operations', () => {
    let bookingId: number;

    test.beforeEach(async ({ request, bookingContext }) => {
        // Create baseline booking before each test
        const response = await request.post('/booking', {
            data: {
                firstname: 'John',
                lastname: 'Doe',
                totalprice: 150,
                depositpaid: true,
                bookingdates: { checkin: '2026-05-01', checkout: '2026-05-05' },
                additionalneeds: 'Breakfast'
            }
        });
        const body = await response.json();
        bookingId = body.bookingid;
        bookingContext.trackID(bookingId); // Track for auto-cleanup
    });

    test('PUT replaces the booking',{tag:'@regression'}, async ({ request, bookingContext }) => {
        const updatedPayload = {
            firstname: 'Jane',
            lastname: 'Smith',
            totalprice: 200,
            depositpaid: false,
            bookingdates: { checkin: '2026-06-01', checkout: '2026-06-10' },
            additionalneeds: 'Late Checkout'
        };

        // Execute PUT operation
        const putResponse = await request.put(`/booking/${bookingId}`, {
            headers: { Cookie: `token=${bookingContext.token}` },
            data: updatedPayload
        });
        expect(putResponse.ok()).toBeTruthy();

        // Verify change against the database using GET
        const getResponse = await request.get(`/booking/${bookingId}`);
        const getBody = await getResponse.json();
        expect(getBody).toEqual(updatedPayload);
    });

    test('PATCH updates only the specified field',{tag:'@regression'}, async ({ request, bookingContext }) => {
        // Modify exactly one field
        const patchPayload = { firstname: 'Robert' };

        const patchResponse = await request.patch(`/booking/${bookingId}`, {
            headers: { Cookie: `token=${bookingContext.token}` },
            data: patchPayload
        });
        expect(patchResponse.ok()).toBeTruthy();

        // Read record to ensure target field changed and unmentioned fields remained pristine
        const getResponse = await request.get(`/booking/${bookingId}`);
        const getBody = await getResponse.json();

        expect(getBody.firstname).toBe('Robert'); // Changed
        expect(getBody.lastname).toBe('Doe');      // Unchanged
        expect(getBody.totalprice).toBe(150);      // Unchanged
    });
});
