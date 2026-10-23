import { test } from '../fixtures/booking-fixture';
import { expect } from "@playwright/test"
test('As a travel agent, I can manage a customer booking lifecycle from creation to cancellation', async ({ request, bookingContext }) => {
    let activeId: number;

    // Step 1: Create
    const createRes = await request.post('/booking', {
        data: {
            firstname: 'Charlie',
            lastname: 'Green',
            totalprice: 300,
            depositpaid: true,
            bookingdates: { checkin: '2026-08-01', checkout: '2026-08-05' },
            additionalneeds: 'Spa Access'
        }
    });
    expect(createRes.ok()).toBeTruthy();
    const createBody = await createRes.json();
    activeId = createBody.bookingid;
    bookingContext.trackID(activeId); // Safe fallback tracker

    // Step 2: Read
    const readRes = await request.get(`/booking/${activeId}`);
    expect(readRes.ok()).toBeTruthy();
    const readBody = await readRes.json();
    expect(readBody.firstname).toBe('Charlie');

    // Step 3: Update (PATCH)
    const updateRes = await request.patch(`/booking/${activeId}`, {
        headers: { Cookie: `token=${bookingContext.token}` },
        data: { totalprice: 350 }
    });
    expect(updateRes.ok()).toBeTruthy();

    // Confirm update via separate GET
    const verifyRes = await request.get(`/booking/${activeId}`);
    const verifyBody = await verifyRes.json();
    expect(verifyBody.totalprice).toBe(350);

    // Step 4: Delete
    const deleteRes = await request.delete(`/booking/${activeId}`, {
        headers: { Cookie: `token=${bookingContext.token}` }
    });
    expect(deleteRes.status()).toBe(201);

    // Step 5: Verify Gone
    const finalCheckRes = await request.get(`/booking/${activeId}`);
    expect(finalCheckRes.status()).toBe(404);
});
