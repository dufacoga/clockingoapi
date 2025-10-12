# ClockInGoAPI - Secure Time & Attendance REST API (Node.js + TypeScript)

<p align="center">
  <a href="https://github.com/dufacoga/clockingoapi/issues"><img src="https://img.shields.io/github/issues/dufacoga/clockingoapi"/></a>
  <a href="https://github.com/dufacoga/clockingoapi/stargazers"><img src="https://img.shields.io/github/stars/dufacoga/clockingoapi"/></a>
  <a href="https://github.com/dufacoga/clockingoapi/network/members"><img src="https://img.shields.io/github/forks/dufacoga/clockingoapi"/></a>
  <a href="https://github.com/dufacoga/clockingoapi/commits/master"><img src="https://img.shields.io/github/last-commit/dufacoga/clockingoapi"/></a>
  <a href="https://github.com/dufacoga/clockingoapi/blob/master/CONTRIBUTING.md"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg"/></a>
  <a href="https://github.com/dufacoga/clockingoapi/blob/master/LICENSE"><img src="https://img.shields.io/github/license/dufacoga/clockingoapi"/></a>
  <br />
  <a href="https://www.paypal.com/donate/?business=R2J9NH55HXKGJ&no_recurring=0&currency_code=USD"><img src="https://img.shields.io/badge/PayPal-Donate-blue.svg"/></a>
  <a href="https://www.patreon.com/dufacoga"><img src="https://img.shields.io/badge/Patreon-Become%20a%20Patron-black.svg"/></a>
  <a href="https://ko-fi.com/dufacoga"><img src="https://img.shields.io/badge/Ko--fi-Buy%20me%20a%20coffee-FFFFFF.svg?logo=ko-fi&logoColor=white"/></a>
</p>

**ClockInGoAPI** is a secure, modular REST API built with Node.js + TypeScript to manage users, roles, locations, clock-in entries, and exits. It powers time & attendance workflows with strict validation, API key protection, and fully documented endpoints.

---

## 🚀 Features

- ✅ REST endpoints for **Users**, **Roles**, **Locations**, **Entries**, and **Exits** with pagination and soft delete flows.
- 🧱 Clean hexagonal-style architecture (domain ➜ application ➜ infrastructure ➜ interfaces) for maintainability and testing.
- 🔒 Security middleware with **API key** auth, **Helmet**, and **CORS** controls.
- 🧾 Zod-based validation for every request body, params, and query string.
- 📑 Swagger UI (OpenAPI 3.0.3) auto-generated documentation with try-it-out support.
- 🧪 End-to-end integration tests powered by **Vitest** and **Supertest** with automatic MariaDB fixtures.
- 🗃️ Knex-powered data access with MariaDB/MySQL compatibility and SQL migration scripts.

---

## 🧰 Tech Stack

- Node.js + Express 5
- TypeScript + ts-node-dev for DX
- Knex + mysql2 (MariaDB/MySQL)
- Swagger UI + swagger-jsdoc
- Zod validation
- Helmet & CORS
- Vitest + Supertest

---

## ⚙️ Configuration

Create a `.env` file (or use the provided `.env.dev` / `.env.test` presets) with the following variables:

```env
PORT=3000
NODE_ENV=development
API_KEY=supersecret123
DB_CLIENT=mysql2
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=clockingo
DB_PASSWORD=clockingo
DB_NAME=clockingo
CORS_ALLOWED_ORIGINS=http://localhost:5173
CORS_ALLOW_CREDENTIALS=false
SWAGGER_ENABLED=true
API_BASE_URL=http://localhost:3000
```

> The Knex connection is configured in [`src/shared/infrastructure/db/knex.ts`](src/shared/infrastructure/db/knex.ts); adjust credentials to match your MariaDB/MySQL instance.

---

## 📂 Project Structure

```bash
src/
├── index.ts                 # Express bootstrap, middlewares, Swagger, routes
├── modules/
│   ├── entries/              # Entry domain + use cases + repositories + REST
│   ├── exits/                # Exit domain + use cases + repositories + REST
│   ├── locations/            # Location domain + use cases + repositories + REST
│   └── users/                # User & role modules
└── shared/
    ├── domain/              # Base entity contracts
    ├── infrastructure/      # Knex configuration
    └── interfaces/          # Swagger, API key, validators, health checks
```

Additional SQL assets live under [`scripts/migrations`](scripts/migrations) and [`scripts/seeds`](scripts/seeds) for dev/test/prod environments.

---

## 🔒 Security

- 🔐 Every request must include a valid `x-api-key` header handled by [`apiKeyAuth`](src/shared/interfaces/rest/apiKeyAuth.ts).
- 🛡️ `helmet()` protects against common HTTP vulnerabilities.
- 🌐 Configurable CORS allowlist with optional credential support.
- 🧼 Centralized error handler hides stack traces in production and returns consistent error payloads.

---

## 🧪 Sample Request (POST /entries)

```http
POST /entries
x-api-key: supersecret123
Content-Type: application/json

{
  "UserId": 1,
  "LocationId": 10,
  "EntryTime": "2025-01-01T08:00:00.000Z",
  "Selfie": "<base64>",
  "DeviceId": "ios-iphone-15"
}
```

The response returns the stored entry, including generated identifiers and flags such as `IsDeleted` and `IsSynced`.

> Explore and try requests directly from `/swagger` (requires `SWAGGER_ENABLED=true`).

---

## 🚀 Run Locally

```bash
git clone https://github.com/ClockInGo/clockingoapi.git
cd clockingoapi
npm install
npm run dev
```

The API starts on `http://localhost:3000` by default. Key routes:

- REST docs: [http://localhost:3000/swagger](http://localhost:3000/swagger)
- Health check: [http://localhost:3000/health](http://localhost:3000/health)

### Using Docker Compose

Spin up MariaDB + API stacks for dev/test/prod with the provided compose file:

```bash
cd server
docker compose -f docker-compose.multi.yml up --build
```

Each service loads its own `.env.*` file and SQL migrations/seeds automatically.

---

## 🧪 Testing

```bash
npm run test
```

Vitest boots an isolated MariaDB schema, truncates tables, and seeds fixture data before every test (`tests/setup`). Integration tests cover all CRUD flows for entries, exits, users, roles, and locations.

---

## 🧃 Sample Data

Seed files under [`scripts/seeds`](scripts/seeds) populate roles, users, locations, entries, and exits for immediate exploration. Tests reuse the same fixtures via [`tests/setup/db.ts`](tests/setup/db.ts).

---

## 👥 Community

- Questions & ideas? [Open an issue](https://github.com/ClockInGo/clockingoapi/issues).
- Found a bug? Include reproduction steps and expected behavior.
- Want to contribute? Fork the repo, create a topic branch, and open a PR—thanks for helping ClockInGo grow!

---

## ✨ Acknowledgements

Thanks to everyone contributing SQL migrations, fixtures, and tests that keep ClockInGoAPI reliable across environments.
