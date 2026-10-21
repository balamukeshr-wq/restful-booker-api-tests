import { APIRequestContext } from "@playwright/test"
import { BookingPayload } from "../types/booking"

const user = process.env.API_USER ?? "admin";
const pass = process.env.API_PASS ?? "password123"; // public demo account
const basicAuth = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

export class BookingClient {
    private request: APIRequestContext;


    constructor(request: APIRequestContext) {
        this.request = request;

    }
    async getToken(username = user, password = pass) {
        return await this.request.post(`/auth`, { data: { username, password } });
    }

    async createBooking(payload: BookingPayload) {
        return await this.request.post('/booking', { data: payload });
    }
    async getBooking(id: number) {
        return await this.request.get(`/booking/${id}`);
    }

    async updateBooking(id: number, payload: BookingPayload) {
        return await this.request.put(`/booking/${id}`, { headers: { Authorization: basicAuth }, data: payload });
    }

    async deleteBooking(id: number) {
        return await this.request.delete(`/booking/${id}`, { headers: { Authorization: basicAuth } });
    }
}

