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
Add .env
If you are in a region where Google AI Studio is not available (not a free‑tier location), uncomment the proxy settings in .env and set your local proxy port.
HTTP_PROXY:  http://host.docker.internal:8888
HTTPS_PROXY: http://host.docker.internal:8888


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

7. for check points run
bash
npm run test:rag

Node_js\hub_2> npm run test:rag

> knowledge-hub@0.0.1 test:rag
> cross-env TEST_MODE=auth jest --testPathPattern rag.e2e.spec.ts --noStackTrace --runInBand --verbose

 PASS  test/rag/rag.e2e.spec.ts (8.782 s)
  chunkText
    √ splits text into chunks with overlap (6 ms)
    √ returns empty array for empty text (2 ms)
  RAG Index (e2e)
    √ should index all articles according to spec (1741 ms)
    √ should index all articles according to spec (1523 ms)
  RAG Search (e2e)
    √ should return ranked chunks according to spec (364 ms)
    √ Should return 400 if quary is empyt (31 ms)
  RAG Delete Article Vectors (e2e)
    √ should delete all vectors for a given articleId (1453 ms)
    √ Should returen 404, if article not exist (20 ms)
  RAG Chat (e2e)
    √ should return answer and sources according to spec (428 ms)
    √ should return 400 if question is missing (19 ms)
  RAG Search with metadata (filters) (e2e)
    √ should filter results by status and category (361 ms)
  RAG Chat with memory (e2e)
    √ should create a new conversation and save messages (781 ms)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
