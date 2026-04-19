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

3.
npm run test:rbac

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

...\Node_js\nodejs-2026q1-knowledge-hub> npm run test:auth

> knowledge-hub@0.0.1 test:auth
> cross-env TEST_MODE=auth jest --testPathIgnorePatterns "refresh|rbac" --noStackTrace --runInBand

 PASS  test/users.e2e.spec.ts
  Users (e2e)
    GET
      √ should correctly get all users (12 ms)
      √ should correctly get user by id (194 ms)
      √ should respond with BAD_REQUEST status code in case of invalid id (11 ms)
      √ should respond with NOT_FOUND status code in case if user doesn't exist (10 ms)
    POST
    ...
        √ should get UNAUTHORIZED without token presented (6 ms)
    DELETE
      √ should get UNAUTHORIZED without token presented (12 ms)

Test Suites: 8 passed, 8 total
Tests:       77 passed, 77 total
Snapshots:   0 total
Time:        6.866 s, estimated 7 s

rbac

ode_js\nodejs-2026q1-knowledge-hub> npm run test:rbac

> knowledge-hub@0.0.1 test:rbac
> cross-env TEST_MODE=auth jest --testPathPattern rbac --noStackTrace --runInBand

 PASS  test/rbac/users.e2e.spec.ts
  RBAC - Users (e2e)
    Viewer role
      √ should allow GET all users (15 ms)
      √ should allow GET own user by id (13 ms)
      √ should deny POST (create user) (12 ms)
      √ should deny PUT on other users (8 ms)
      √ should deny DELETE other users (7 ms)
    
    ...
    
      √ should deny PUT category (7 ms)
      √ should deny DELETE category (6 ms)
    Editor role
      √ should allow GET all categories (9 ms)
      √ should deny POST category (6 ms)
      √ should deny PUT category (7 ms)
      √ should deny DELETE category (6 ms)
    Admin role
      √ should allow full CRUD on categories (47 ms)

Test Suites: 4 passed, 4 total
Tests:       35 passed, 35 total
Snapshots:   0 total
Time:        6.14 s
Ran all test suites matching /rbac/i.
Jest did not exit one second after the test run has completed.
