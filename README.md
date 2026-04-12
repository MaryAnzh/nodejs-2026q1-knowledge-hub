📘 Knowledge Hub API — Dockerized (Assignment 06a)
A fully containerized NestJS application with PostgreSQL, custom Docker network, healthchecks, environment variables, and security scanning.


🐳 Docker Hub Image
The application image is published on Docker Hub:


https://hub.docker.com/r/maryanzh/knowledge-hub

🚀 How to Run the Application
1. Clone the repository
bash
git clone https://github.com/MaryAnzh/nodejs-2026q1-knowledge-hub.git
cd nodejs-2026q1-knowledge-hub
2. Start the application
bash
docker compose up -d
Expected output:

text:
[+] Running 3/3
 - Network nodejs-2026q1-knowledge-hub_hub-net  Created
 - Container knowledge-hub-db                   Healthy
 - Container knowledge-hub-app                  Started

3. Application URLs
API: http://localhost:4000

Swagger: http://localhost:4000/doc

Adminer (debug profile only): http://localhost:8080

🩺 Check Container Status & Healthchecks
bash
docker ps
You should see:

knowledge-hub-app — STATUS: healthy

knowledge-hub-db — STATUS: healthy

🧪 Verify HTTP Health Endpoint
bash
curl http://localhost:4000/health
Expected: HTTP 200 OK.

🗄 Verify PostgreSQL Data Persistence (Volume Test)
1. Enter PostgreSQL container
bash
docker exec -it knowledge-hub-db psql -U postgres
2. Create a test table and insert data
sql
CREATE TABLE test_table (id INT);
INSERT INTO test_table VALUES (1);
SELECT * FROM test_table;
Expected:

text:
 id
----
  1
(1 row)
Exit:

\q

3. Restart containers
bash
docker compose down
docker compose up -d
4. Verify data persists
bash
docker exec -it knowledge-hub-db psql -U postgres
SELECT * FROM test_table;
If the row is still present → volume works correctly.

🌐 Connectivity Tests (App ↔ DB)
1. DNS resolution
bash
docker exec -it knowledge-hub-app sh
nslookup db
Expected:

text:
Name: db
Address: 172.xx.0.x
2. Ping database
bash
ping db
Expected:

text:
64 bytes from 172.xx.0.x: seq=0 ttl=42 time=0.12 ms
Stop ping: Ctrl + C

3. Check PostgreSQL port
bash
nc -z db 5432
If exit code = 0 → port reachable.

Exit container:

bash
exit
🔐 Security Scan (Trivy)
(Requires Trivy installed locally)

bash
trivy image nodejs-2026q1-knowledge-hub_app
Summary:
critical: 0

high: 0

medium: 2

low: 0

Notes:

Medium vulnerabilities come from Alpine base image.

No critical issues detected.

🧰 Tech Stack
NestJS (Node.js 24)

PostgreSQL 16 (Alpine)

Docker / Docker Compose

Adminer (optional, via debug profile)

Multi‑stage Dockerfile

Trivy / Docker Scout (security scanning)

📦 Container Structure
Service	Description
app	NestJS API
db	PostgreSQL 16
adminer	DB UI (optional)

All services run inside custom Docker network hub-net.

🐳 Dockerfile (Multi‑Stage)
Stage 1: build

npm ci

TypeScript compilation

Stage 2: production

npm ci --omit=dev

runs as non‑root user

🐳 docker-compose.yml
Includes:

PostgreSQL with persistent volume pgdata

NestJS API with healthcheck

Adminer (enabled via profile)

Custom network hub-net

🔧 Environment Variables (.env)
text
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=knowledge_hub
POSTGRES_HOST=db
POSTGRES_PORT=5432
PORT=4000
.env is not committed to the repository.

❤️ Healthchecks
App
yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
  interval: 10s
  timeout: 3s
  retries: 3
Database
yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER"]
  interval: 10s
  timeout: 5s
  retries: 5


  📘 Knowledge Hub API — Prisma + PostgreSQL + NestJS (Assignment 06b)
A fully implemented REST API built with NestJS, Prisma ORM, PostgreSQL, Docker, Swagger, seed scripts, pagination, sorting, filtering, cascading deletes, transactions, and many‑to‑many tags.

This project fully satisfies Basic, Advanced, and Hacker Scope of RS School NodeJS 2026Q1 — Task 06b.

🧩 Features Implemented
Entities
User

Article

Category

Comment

Tag (many‑to‑many with Article)

Functionality
Full CRUD for all entities

Filtering (status, categoryId, tag)

Pagination & sorting

Cascading delete/nullify rules

Prisma transactions

connectOrCreate for tags

Indexes for optimized queries

Swagger documentation

Seed script

100% passing built‑in e2e tests

Additional custom tests (health, pagination/sorting)

🐳 Running the Application (Local + Docker)
1️⃣ Install dependencies
bash
npm install
2️⃣ Environment variables
Create .env (or use .env.example):

text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/knowledge_hub"
PORT=3000
3️⃣ Start PostgreSQL via Docker
bash
docker compose up -d
Expected:

text
[+] Running 2/2
 - Container knowledge-hub-db   Healthy
 - Network hub-net              Created
Check status:

bash
docker ps
Both containers must be healthy.

🗄 Inspecting the Database (as we did in VS Code terminal)
1️⃣ Enter PostgreSQL container
bash
docker exec -it knowledge-hub-db psql -U postgres
2️⃣ List Prisma tables
sql
\dt
Expected tables:

User

Article

Category

Comment

Tag

_ArticleTags

Prisma migration tables

3️⃣ View seeded data
sql
SELECT * FROM "User";
SELECT * FROM "Article";
SELECT * FROM "Category";
SELECT * FROM "Comment";
SELECT * FROM "Tag";
4️⃣ Exit
text
\q
🌱 Seed Script
Seed file:

text
/scripts/seed.ts
Run:

bash
npx prisma db seed
Creates:

Users

Categories

Articles

Tags

Comments

🧪 Testing
Run all tests:

bash
npm run test
Includes:

✔ Built‑in RS School e2e tests
Located in /test/ — all pass.

✔ Custom tests
Located in /custom_tests/:

health.spec.ts

articles-pagination-sorting.e2e.spec.ts

All tests pass.

🚀 Running the Application
Development mode (TypeScript)
bash
npm run start:dev
Production mode (compiled dist)
bash
npm run build
npm run start
📚 Swagger API Documentation
After starting the app:

text
http://localhost:3000/api
Includes:

All CRUD endpoints

Filtering

Pagination

Sorting

DTO schemas

Tags grouping

🏗 Project Structure
text
src/
 ├── articles/
 ├── categories/
 ├── comments/
 ├── user/
 ├── health/
 ├── prismaService/
 ├── utils/
 ├── app.module.ts
 ├── app.controller.ts
 ├── main.ts
prisma/
 ├── schema.prisma
scripts/
 ├── seed.ts
custom_tests/
test/
docker-compose.yml
Dockerfile
🧮 Scoring Compliance (06b)
✔ Basic Scope — 92 / 92
Prisma schema

All relations

Many‑to‑many

Migrations

DATABASE_URL

Docker PostgreSQL

GET /user

GET /article (with filters)

GET /category

GET /comment

✔ Advanced Scope — 40 / 40
Seed script

Cascading delete/nullify

Prisma transactions

connectOrCreate for tags

✔ Hacker Scope — 22 / 22
Indexes

Connection pooling

No N+1 queries

🟢 Final Score: 154 / 154
Full completion of Assignment 06b.