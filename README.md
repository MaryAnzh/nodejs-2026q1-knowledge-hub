📘 Knowledge Hub API — 8a Test
A fully containerized NestJS application with PostgreSQL, custom Docker network, healthchecks, environment variables, and security scanning.

🚀 How to Run the Application
1. Clone the repository
bash
git clone https://github.com/MaryAnzh/nodejs-2026q1-knowledge-hub.git
cd nodejs-2026q1-knowledge-hub
2.
git checkout develop_logging_8b

3. Start the application
bash
docker compose build app
docker compose up -d

4.1 for whotch logs
bash
docker logs knowledge-hub-app -f

in other terminal page
npx prisma migrate deploy


4.2 For look json
docker exec -it knowledge-hub-app sh
$: ls -la /app/logs
your]ll see
total 48
drwxrwxrwx 1 root    root      4096 Apr 25 17:04 .
drwxr-xr-x 1 root    root      4096 Apr 25 16:50 ..
-rw-r--r-- 1 appuser appgroup 37272 Apr 25 17:17 app.log
file name is app.log
for whotch file
 cat /app/logs/<file name>
$: cat /app/logs/app.log
