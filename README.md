📘 Knowledge Hub API — 8B Logging
A fully containerized NestJS application with PostgreSQL, custom Docker network, healthchecks, environment variables, and security‑scanned images.

🚀 How to Run the Application
1. Clone the repository
bash
git clone https://github.com/MaryAnzh/nodejs-2026q1-knowledge-hub.git
cd nodejs-2026q1-knowledge-hub

2. Switch to the logging branch
bash
git checkout develop_ai_9a

3. Start the application
bash
docker compose build app
docker compose up -d
npx prisma migrate deploy

4. npm run test:ai

#  us it in .env if your use prosy to avoid rate limit during development
# HTTP_PROXY:  http://host.docker.internal:8888
# HTTPS_PROXY: http://host.docker.internal:8888
