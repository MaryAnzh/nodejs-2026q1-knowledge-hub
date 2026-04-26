📘 Knowledge Hub API — 8B Logging
A fully containerized NestJS application with PostgreSQL, custom Docker network, healthchecks, environment variables, and security‑scanned images.

🚀 How to Run the Application
1. Clone the repository
bash
git clone https://github.com/MaryAnzh/nodejs-2026q1-knowledge-hub.git
cd nodejs-2026q1-knowledge-hub

2. Switch to the logging branch
bash
git checkout develop_logging_8b

3. Start the application
bash
docker compose build app
docker compose up -d
npx prisma migrate deploy

📁 Logs folder
When Docker starts, it automatically creates the folder:

logs/
in the project root, because it is mounted as a volume:

./logs:/app/logs
All application logs are written into this folder.

To test rotation, set a small limit in .env.docker, for example:

```
LOG_MAX_FILE_SIZE=100
```
Then run tests 2–3 times.
bask
npm run test:jest

🔍 How to watch logs
4.1 View logs in real time
bash
docker logs -f knowledge-hub-app
or
docker compose down
doker compose up --build
and your can see logs in real time

4.2 Generate more logs
In another terminal:

bash
npm run test

Then to inspect log files inside the container
bash
docker exec -it knowledge-hub-app sh
$: ls -la /app/logs
You will see something like:

```
total 48
drwxrwxrwx 1 root    root      4096 Apr 25 17:04 .
drwxr-xr-x 1 root    root      4096 Apr 25 16:50 ..
-rw-r--r-- 1 appuser appgroup 37272 Apr 25 17:17 app.log
To view a file:
```

bash
$: cat /app/logs/app.log
Exit the container:

bash
$: exit

🔄 Log rotation example
If you set LOG_MAX_FILE_SIZE=100 and run tests several times, you will see rotated files:

total 396
drwxrwxrwx 1 root    root       4096 Apr 25 19:39 .
drwxr-xr-x 1 root    root       4096 Apr 25 19:15 ..
-rw-r--r-- 1 appuser appgroup 102427 Apr 25 19:33 app-2026-04-25T19-33-25-603Z.log
-rw-r--r-- 1 appuser appgroup 102520 Apr 25 19:36 app-2026-04-25T19-36-45-943Z.log
-rw-r--r-- 1 appuser appgroup 102482 Apr 25 19:39 app-2026-04-25T19-39-07-047Z.log
-rw-r--r-- 1 appuser appgroup  77724 Apr 25 19:40 app.log
Rotation works as required:

app.log is renamed to app-<timestamp>.log

a new app.log is created

logging continues into the new file

⚙️ Environment variables

NODE_ENV=development
LOG_LEVEL=log
LOG_MAX_FILE_SIZE=1024 // 100 for rotation testing

✅ Implemented Features (Task 8B)

Basic Scope
✔ Configurable NestJS logger via LOG_LEVEL

✔ Incoming request logging (method, URL, params, body)

✔ Outgoing response logging (status code, duration)

✔ Global exception filter with structured JSON output

✔ Custom error classes:
- ValidationCustomError
- NotFoundCustomError
- UnauthorizedCustomError
- ForbiddenCustomError

✔ Custom errors used in services and controllers

Advanced Scope
✔ Log file rotation via LOG_MAX_FILE_SIZE

✔ Sensitive data masking (password, token → ***)

✔ uncaughtException listener with fatal logging + graceful shutdown

✔ unhandledRejection listener with error logging + graceful shutdown

✔ Graceful shutdown on SIGTERM and SIGINT (Docker stop)