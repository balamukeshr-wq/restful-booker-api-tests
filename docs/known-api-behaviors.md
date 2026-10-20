# Known API Behaviors

Observed against https://restful-booker.herokuapp.com using Postman on 2026-10-19.

| Endpoint | Scenario | Observed result |
| --- | --- | --- |
| GET /ping | Health check | 201, body is the text "Created" |
| POST /auth | Valid credentials | 200, JSON body with a `token` |
| POST /auth | Invalid credentials | 200, JSON body with the message "Bad credentials" |
| GET /booking | List bookings | 200, array of objects containing only `bookingid` |
| GET /booking/{id} | Existing id | 200, full booking object |
| POST /booking | Valid payload | 200, JSON body with the new `bookingid` and the created booking |
| PUT /booking/{id} | No auth | 403 Forbidden |
| PUT /booking/{id} | Basic Auth | 200, the full updated booking |
| PATCH /booking/{id} | Basic Auth | 200, the booking with only the sent fields changed |
| DELETE /booking/{id} | No auth | 403 Forbidden |
| DELETE /booking/{id} | Basic Auth | 201 Created, body is the text "Created" |
| GET /booking/{id} | After delete | 404 Not Found |

## Quirks worth noting

- **Non-standard status codes.** `GET /ping` and `DELETE /booking/{id}` both return 201 Created with the text "Created". Most REST APIs use 200 or 204 for these. The tests assert the observed behavior.
- **Invalid login is not an error status.** Bad credentials on `POST /auth` return 200 OK, with the failure shown only in the response body. Tests must check the body, because the status code alone cannot tell a failed login from a successful one.
- **Basic Auth works for write operations.** `PUT`, `PATCH` and `DELETE` accept HTTP Basic Auth (`admin` / `password123`, the API's public demo account).
