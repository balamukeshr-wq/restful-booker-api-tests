# Restful-Booker API Tests

![API Tests](https://github.com/balamukeshr-wq/restful-booker-api-tests/actions/workflows/api-tests.yml/badge.svg)

API test automation for the public [Restful-Booker](https://restful-booker.herokuapp.com) booking service, built with **Playwright** and **TypeScript**. The suite runs on every push and pull request, and nightly, in GitHub Actions.

## What is covered

| Area | What the tests check |
| --- | --- |
| Health | `GET /ping` responds with the expected status and body |
| Authentication | A valid login returns a token; invalid credentials are rejected with "Bad credentials" |
| Create | `POST /booking` returns a booking id and echoes the booking that was sent |
| Read | `GET /booking/{id}` returns exactly what was created |
| Update | `PUT` replaces the whole booking; `PATCH` changes only the field sent |
| Delete | `DELETE` removes the booking and a later `GET` returns 404 |
| Lifecycle | One test walks create, read, update, delete and verify-gone |
| Negative cases | Requests without a token are rejected with 403; unknown ids return 404; an incomplete payload is rejected |
| Response checks | Create and read responses are JSON |

**14 tests.** Tests tagged `@smoke` are the fast core; `@regression` covers the rest.

## Run it

```bash
npm ci
npm test                  # all tests
npm run test:smoke        # only @smoke
npm run test:regression   # only @regression
npm run report            # open the last HTML report
```

No browser is needed, because every test is an API call.

Optional environment variables (the defaults are the API's public demo account):

| Variable | Default |
| --- | --- |
| `BASE_URL` | `https://restful-booker.herokuapp.com` |
| `API_USER` | `admin` |
| `API_PASS` | `password123` |

## Project structure

```text
.
├── .github/workflows/api-tests.yml   # CI: run tests on push, pull request and nightly
├── api/bookingClient.ts              # One method per endpoint
├── data/bookingData.ts               # Faker-based booking payload builder
├── fixtures/base.ts                  # Client, auth token and automatic cleanup fixtures
├── tests/                            # Specs, grouped by feature
├── types/booking.ts                  # Booking types
├── postman/                          # Exported Postman collection and environment
├── docs/                             # Known API behaviors and Postman run result
└── playwright.config.ts
```

## Design decisions

- **A client class wraps every endpoint.** Tests never build URLs or set headers by hand, so a change to the API touches one file.
- **Fixtures provide the client, an auth token and cleanup.** Tests ask for what they need and start at the interesting line.
- **Every test creates its own data and removes it.** The API is shared and public, so tests never depend on existing records or on each other. Cleanup runs even when a test fails.
- **Test data is generated, not hardcoded.** `buildBooking()` creates a valid, randomized booking and accepts overrides to change a single field.
- **Tests assert the API's real behavior**, including its quirks, instead of what a textbook REST API would do.

## Known API behaviors

Restful-Booker does a few unusual things, and the tests assert them as they are:

- `GET /ping` and `DELETE /booking/{id}` return **201 Created** with the text "Created".
- A failed login returns **200 OK** with "Bad credentials" in the body, so tests must check the body.
- `PUT`, `PATCH` and `DELETE` accept either a token cookie or HTTP Basic Auth, and return 403 without either.

The full table of observed behavior is in [docs/known-api-behaviors.md](docs/known-api-behaviors.md).

## Postman

The collection and environment used to explore the API are in [`postman/`](postman/). Every request has tests, and the whole collection runs green in Collection Runner:

![Postman Collection Runner result](docs/postman-run.png)

The final 404 is expected: it confirms the booking was deleted.

## Continuous integration

[`api-tests.yml`](.github/workflows/api-tests.yml) runs the suite on every push to `main`, on every pull request, every night at 03:00 UTC, and on demand. The HTML report is uploaded as a build artifact after each run.

## Tech stack

Playwright Test, TypeScript, Faker, Postman, GitHub Actions.
