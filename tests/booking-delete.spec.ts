import { test, expect } from '../fixtures/base';

test('DELETE removes the booking',{tag:'@regression'} ,async ({ request, bookingContext }) => {
    // 1. Create a transient booking
    const createResponse = await request.post('/booking', {
        data: {
            firstname: 'Alice',
            lastname: 'Brown',
            totalprice: 90,
            depositpaid: true,
            bookingdates: { checkin: '2026-07-01', checkout: '2026-07-03' },
            additionalneeds: 'None'
        }
    });
    const createBody = await createResponse.json();
    const idToDelete = createBody.bookingid;

    // 2. Perform Delete (Restful-Booker typically responds with 201 Created for DELETE actions)
    const deleteResponse = await request.delete(`/booking/${idToDelete}`, {
        headers: { Cookie: `token=${bookingContext.token}` }
    });
    expect(deleteResponse.status()).toBe(201);

    // 3. Confirm target resource returns a 404
    const getResponse = await request.get(`/booking/${idToDelete}`);
    expect(getResponse.status()).toBe(404);
});
