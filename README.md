📘 Knowledge Hub API — 8a Test
A fully containerized NestJS application with PostgreSQL, custom Docker network, healthchecks, environment variables, and security scanning.

🚀 How to Run the Application
1. Clone the repository
bash
git clone https://github.com/MaryAnzh/nodejs-2026q1-knowledge-hub.git
cd nodejs-2026q1-knowledge-hub
2.
git checkout develop_testing_task_8a

3. Start the application
bash
docker compose up -build

npx prisma migrate deploy

4. For test
4.1 all tests (jest + vitest)
bash
npm run test

4.2 Unit tests (vitests)
bash
npm run test:unit

4.2 coverage
bash
npm run test:coverage

Coverage thresholds met

Lines: 93%

Branches: 85.51%

Functions: 93.18%

Statements: 93.35%  


All tests
> knowledge-hub@0.0.1 test
> npm run test:jest && npm run test:unit

> knowledge-hub@0.0.1 test:jest
> cross-env TEST_MODE=auth jest --runInBand --testPathPattern "auth|rbac|articles|comments|categories|users"

 PASS  test/users.e2e.spec.ts (6.802 s)
 PASS  test/rbac/users.e2e.spec.ts
 PASS  test/rbac/articles.e2e.spec.ts
 PASS  test/rbac/categories.e2e.spec.ts
 PASS  test/rbac/comments.e2e.spec.ts
 PASS  test/articles.e2e.spec.ts
 PASS  test/categories.e2e.spec.ts
 PASS  test/comments.e2e.spec.ts
 PASS  test/auth/articles.e2e.spec.ts
 PASS  test/auth/users.e2e.spec.ts
 PASS  test/auth/categories.e2e.spec.ts
 PASS  test/auth/comments.e2e.spec.ts

Test Suites: 12 passed, 12 total
Tests:       112 passed, 112 total
Snapshots:   0 total
Time:        16.404 s
Ran all test suites matching /auth|rbac|articles|comments|categories|users/i.

> knowledge-hub@0.0.1 test:unit
> vitest --run

 RUN  v4.1.5 D:/development/study/Node_js/hub_2

 ✓ src/user/user.service.unit.spec.ts (12 tests) 31ms
 ✓ src/auth/auth.service.unit.spec.ts (13 tests) 41ms
 ✓ src/articles/articles.service.unit.spec.ts (20 tests) 41ms
 ✓ src/auth/guards/access.guard.unit.spec.ts (12 tests) 19ms
 ✓ src/categories/categories.service.unit.spec.ts (8 tests) 25ms
 ✓ src/comments/comments.service.unit.spec.ts (8 tests) 25ms
 ✓ src/auth/auth.controller.unit.spec.ts (5 tests) 18ms
 ✓ src/categories/categories.controller.unit.spec.ts (5 tests) 17ms
 ✓ src/user/user.controller.unit.spec.ts (6 tests) 20ms
 ✓ src/auth/guards/roles.guard.unit.spec.ts (4 tests) 15ms
 ✓ src/comments/comments.controller.unit.spec.ts (5 tests) 18ms
 ✓ src/user/dto/update-user.dto.unit.spec.ts (6 tests) 14ms
 ✓ src/articles/articles.controller.unit.spec.ts (6 tests) 19ms
 ✓ src/auth/decorators/roles.decorator.unit.spec.ts (1 test) 13ms
 ✓ src/pipes/parse-uuid.pipe.unit.spec.ts (2 tests) 9ms
 ✓ src/auth/decorators/user.decorator.unit.spec.ts (1 test) 8ms
 ✓ src/articles/dto/create-article.dto.unit.spec.ts (3 tests) 12ms

 Test Files  17 passed (17)
      Tests  117 passed (117)
   Start at  19:05:37
   Duration  12.75s (transform 1.3

   Table
    Test Files  17 passed (17)
      Tests  117 passed (117)
   Start at  19:08:54
   Duration  15.13s (transform 1.75s, setup 1.07s, import 30.73s, tests 477ms, environment 5ms)


 % Coverage report from v8
---------------------------|---------|----------|---------|---------|--------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------|---------|----------|---------|---------|--------------------
All files                  |      93 |    85.51 |   93.18 |   93.35 |
 articles                  |   87.93 |    82.53 |      90 |   88.67 |
  articles.controller.ts   |     100 |      100 |     100 |     100 |
  articles.service.ts      |   85.71 |    81.03 |   85.71 |   86.36 | 36,138,171-173,185
 articles/dto              |       0 |        0 |       0 |       0 |
  create-article.dto.ts    |       0 |        0 |       0 |       0 |
  update-article.dto.ts    |       0 |        0 |       0 |       0 |
 auth                      |   98.03 |    94.44 |     100 |   98.03 |
  auth.controller.ts       |     100 |      100 |     100 |     100 |
  auth.service.ts          |   97.56 |    93.75 |     100 |   97.56 | 114
  token-store.ts           |     100 |      100 |     100 |     100 |
 auth/decorators           |     100 |      100 |     100 |     100 |
  auth.decorator.ts        |     100 |      100 |     100 |     100 |
  roles.decorator.ts       |     100 |      100 |     100 |     100 |
  user.decorator.ts        |     100 |      100 |     100 |     100 |
 auth/dto                  |       0 |        0 |       0 |       0 |
  login.dto.ts             |       0 |        0 |       0 |       0 |
  signup.dto.ts            |       0 |        0 |       0 |       0 |
 auth/guards               |     100 |    93.75 |     100 |     100 |
  access.guard.ts          |     100 |     87.5 |     100 |     100 | 21
  roles.guard.ts           |     100 |      100 |     100 |     100 |
 categories                |     100 |      100 |     100 |     100 |
  categories.controller.ts |     100 |      100 |     100 |     100 |
  categories.service.ts    |     100 |      100 |     100 |     100 |
 categories/dto            |       0 |        0 |       0 |       0 |
  create-category.dto.ts   |       0 |        0 |       0 |       0 |
  update-category.dto.ts   |       0 |        0 |       0 |       0 |
 comments                  |   79.48 |    68.18 |    92.3 |   79.41 |
  comments.controller.ts   |     100 |      100 |     100 |     100 |
  comments.service.ts      |   74.19 |       65 |    87.5 |   74.07 | 62-75
 comments/dto              |       0 |        0 |       0 |       0 |
  create-comment.dto.ts    |       0 |        0 |       0 |       0 |
 constants                 |     100 |      100 |     100 |     100 |
  articles.ts              |     100 |      100 |     100 |     100 |
  dictionary.ts            |     100 |      100 |     100 |     100 |
  index.ts                 |       0 |        0 |       0 |       0 |
  routes.ts                |     100 |      100 |     100 |     100 |
  user.ts                  |     100 |      100 |     100 |     100 |
 pipes                     |     100 |      100 |     100 |     100 |
  parse-uuid.pipe.ts       |     100 |      100 |     100 |     100 |
 prismaService             |   33.33 |      100 |       0 |   33.33 |
  prisma.service.ts        |   33.33 |      100 |       0 |   33.33 | 11-24
 test-utils                |     100 |       50 |     100 |     100 |
  createConfigMock.ts      |     100 |       50 |     100 |     100 | 25
  createJwtMock.ts         |     100 |      100 |     100 |     100 |
  createPrismaMock.ts      |     100 |      100 |     100 |     100 |
  index.ts                 |       0 |        0 |       0 |       0 |
  test-constants.ts        |     100 |      100 |     100 |     100 |
 types                     |       0 |        0 |       0 |       0 |
  articles.ts              |       0 |        0 |       0 |       0 |
  auth.ts                  |       0 |        0 |       0 |       0 |
  categories.ts            |       0 |        0 |       0 |       0 |
  comments.ts              |       0 |        0 |       0 |       0 |
  index.ts                 |       0 |        0 |       0 |       0 |
  user.ts                  |       0 |        0 |       0 |       0 |
 user                      |     100 |      100 |     100 |     100 |
  user.controller.ts       |     100 |      100 |     100 |     100 |
  user.service.ts          |     100 |      100 |     100 |     100 |
 user/dto                  |       0 |        0 |       0 |       0 |
  create-user.dto.ts       |       0 |        0 |       0 |       0 |
  update-user-role.dto.ts  |       0 |        0 |       0 |       0 |
  update-user.dto.ts       |       0 |        0 |       0 |       0 |
---------------------------|---------|----------|---------|---------|--------------------