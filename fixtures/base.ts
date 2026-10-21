import { test as base } from "@playwright/test";
import { BookingClient } from "../api/bookingClient"
type MyFixtures = {
    bookingClient: BookingClient;
   
};

export const test = base.extend<MyFixtures>({

    bookingClient: async ({ request }, use) => {
        const client = new BookingClient(request);
        await use(client);
    },

})

export { expect } from '@playwright/test';
