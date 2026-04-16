📘 Knowledge Hub API — 7a Auth
A fully containerized NestJS application with PostgreSQL, custom Docker network, healthchecks, environment variables, and security scanning.

🚀 How to Run the Application
1. Clone the repository
bash
git clone https://github.com/MaryAnzh/nodejs-2026q1-knowledge-hub.git
cd nodejs-2026q1-knowledge-hub
2.
git checkout develop_auth_7a

3. Start the application
bash
docker compose up -build

npx prisma migrate deploy

4. Application URLs
API: http://localhost:4000

Swagger: http://localhost:4000/doc

Test:
1.
npm run test:refresh
2. auth folder from test
npx jest test/auth

  1. result
  Refresh
      √ should correctly get new tokens pair (19 ms)
      √ should fail with 403 (invalid refresh token) (25 ms)
      √ should fail with 401 (no refresh token) (6 ms)
      √ should fail with 403 (expired refresh token) (10 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total

2. result

PS D:***\nodejs-2026q1-knowledge-hub> npx jest test/auth
 PASS  test/auth/users.e2e.spec.ts (5.683 s)
  Users (e2e)
    GET all users
      √ should get UNAUTHORIZED without token presented (77 ms)
    GET user by id
      √ should get UNAUTHORIZED without token presented (11 ms)
    POST
      √ should get UNAUTHORIZED without token presented (10 ms)
    PUT
      √ should get UNAUTHORIZED without token presented (17 ms)
    DELETE
      √ should get UNAUTHORIZED without token presented (10 ms)

 PASS  test/auth/categories.e2e.spec.ts (5.749 s)
  Category (e2e)
    GET all categories
      √ should get UNAUTHORIZED without token presented (89 ms)
    GET category by id
      √ should get UNAUTHORIZED without token presented (12 ms)
    POST
      √ should get UNAUTHORIZED without token presented (11 ms)
    PUT
      √ should get UNAUTHORIZED without token presented (14 ms)
    DELETE
      √ should get UNAUTHORIZED without token presented (11 ms)

 PASS  test/auth/articles.e2e.spec.ts
  Article (e2e)
    GET all articles
      √ should get UNAUTHORIZED without token presented (13 ms)
    GET article by id
      √ should get UNAUTHORIZED without token presented (10 ms)
    POST
      √ should get UNAUTHORIZED without token presented (8 ms)
    PUT
      √ should get UNAUTHORIZED without token presented (10 ms)
    DELETE
      √ should get UNAUTHORIZED without token presented (13 ms)

 PASS  test/auth/comments.e2e.spec.ts (5.966 s)
  Comment (e2e)
    GET comments by articleId
      √ should get UNAUTHORIZED without token presented (79 ms)
    GET comment by id
      √ should get UNAUTHORIZED without token presented (10 ms)
    POST
      √ should get UNAUTHORIZED without token presented (9 ms)
    DELETE
      √ should get UNAUTHORIZED without token presented (7 ms)

Test Suites: 4 passed, 4 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        7.809 s