📘 Knowledge Hub API — 8B Logging
A fully containerized NestJS application with PostgreSQL, custom Docker network, healthchecks, environment variables, and security‑scanned images.

🚀 How to Run the Application
1. Clone the repository
bash
git clone https://github.com/MaryAnzh/nodejs-2026q1-knowledge-hub.git
cd nodejs-2026q1-knowledge-hub

2. Switch to the logging branch
bash
git checkout develop_10_rag_ai

3. use it in .env if your use prosy to avoid rate limit during development
# HTTP_PROXY:  http://host.docker.internal:8888
# HTTPS_PROXY: http://host.docker.internal:8888

4. run docker
bash
docker compose up --build
in other terminal
npx prisma migrate deploy

5. for check vector db health
curl http://localhost:6333/healthz

or open http://localhost:6333/healthz

- if db health your can see

StatusCode        : 200
StatusDescription : OK
Content           : healthz check passed
RawContent        : HTTP/1.1 200 OK
                    vary: Origin, Access-Control-Request-Method, Access-Control-Request-Headers
                    Content-Length: 20
                    Content-Type: text/plain; charset=utf-8
                    Date: Sun, 10 May 2026 11:57:54 GMT
                    health...
or 
healthz check passed

6. run seed for add article data in db
bush:
npm run db:seed

