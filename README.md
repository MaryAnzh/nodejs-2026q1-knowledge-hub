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
Код
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