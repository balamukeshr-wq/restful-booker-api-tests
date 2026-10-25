import { test as base } from '@playwright/test';
import { BookingClient } from '../api/bookingClient';

const user = process.env.API_USER ?? 'admin';
const pass = process.env.API_PASS ?? 'password123'; // public demo account

type BookingContext = {
    token: string;
    trackID: (id: number) => void;
};

type Fixtures = {
    bookingClient: BookingClient;
    authToken: string;
    bookingContext: BookingContext;
    trackBooking: (id: number) => void;
};

export const test = base.extend<Fixtures>({
    bookingClient: async ({ request }, use) => {
        await use(new BookingClient(request));
    },

    authToken: async ({ bookingClient }, use) => {
        const res = await bookingClient.getToken(user, pass);
        const { token } = await res.json();
        await use(token);
    },

    bookingContext: async ({ bookingClient, authToken }, use) => {
        const trackedIds: number[] = [];
        const context: BookingContext = {
            token: authToken,
            trackID: (id: number) => trackedIds.push(id),
        };

        await use(context);

        for (const id of trackedIds) {
            await bookingClient.deleteBooking(id);
        }
    },

    // Auto-cleanup: delete every tracked booking after the test.
    trackBooking: async ({ bookingClient, authToken }, use) => {
        const ids: number[] = [];
        await use((id) => {
            ids.push(id);
        });
        for (const id of ids) {
            await bookingClient.deleteBooking(id);
        }
    },
});

export { expect } from '@playwright/test';