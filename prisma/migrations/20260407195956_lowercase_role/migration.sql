/*
  Warnings:

  - The values [DRAFT,PUBLISHED,ARCHIVED] on the enum `ArticleStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,EDITOR,VIEWER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ArticleStatus_new" AS ENUM ('draft', 'published', 'archived');
ALTER TABLE "public"."Article" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Article" ALTER COLUMN "status" TYPE "ArticleStatus_new" USING ("status"::text::"ArticleStatus_new");
ALTER TYPE "ArticleStatus" RENAME TO "ArticleStatus_old";
ALTER TYPE "ArticleStatus_new" RENAME TO "ArticleStatus";
DROP TYPE "public"."ArticleStatus_old";
ALTER TABLE "Article" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'editor', 'viewer');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'viewer';
COMMIT;

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "status" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'viewer';
