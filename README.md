# Knowledge Hub

For check task:

## Downloading

```
git clone https://github.com/MaryAnzh/nodejs-2026q1-knowledge-hub.git
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```
And you will see

🚀 Server is running on http://localhost:4000
📘 Swagger documentation is available at http://localhost:4000/doc

After starting the app on port (4000) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/

## Testing

After application running open new terminal and enter:

To run all task test (task + custom)

```
npm test
```

> knowledge-hub@0.0.1 test
> jest --testMatch "<rootDir>/src/*.spec.ts" "<rootDir>/test/*.spec.ts" --runInBand

 PASS  src/articles.controller.pagination.e2e.spec.ts
 PASS  test/articles.e2e.spec.ts
 PASS  test/users.e2e.spec.ts
 PASS  test/categories.e2e.spec.ts
 PASS  src/articles.service.pagination.e2e.spec.ts
 PASS  test/comments.e2e.spec.ts

Test Suites: 6 passed, 6 total
Tests:       68 passed, 68 total

To run task test (users, articles, categories, comments)

```
npm test -- users articles categories comments
```
Test Suites: 4 passed, 4 total
Tests:       58 passed, 58 total

to run custom test for pagination and sorting

```
npm test -- pagination
```

> knowledge-hub@0.0.1 test
> jest --testMatch "<rootDir>/src/*.spec.ts" "<rootDir>/test/*.spec.ts" --runInBand pagination

 PASS  src/articles.controller.pagination.e2e.spec.ts
 PASS  src/articles.service.pagination.e2e.spec.ts

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total


### Lint check

```
npm run lint
```
