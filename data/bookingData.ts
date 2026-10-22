import { faker } from "@faker-js/faker";
import { BookingPayload } from "../types/booking";

const checkin = faker.date.soon({ days: 2 });
const checkout = new Date(checkin.getTime() + faker.number.int({ min: 1, max: 8 }) * 86_400_000);
const day = (d: Date) => d.toISOString().split('T')[0];

export function buildBooking(overrides?: Partial<BookingPayload>): BookingPayload {
    return {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        totalprice: faker.number.int({ min: 100, max: 1000 }),
        depositpaid: faker.datatype.boolean(),

        bookingdates: {
            checkin: day(checkin),
            checkout: day(checkout)
        },
        additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Late Checkout', 'Extra Pillows']),
        ...overrides,
    };

}
