import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reset() {
    try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE 
      "User", 
      "Article", 
      "Category", 
      "Comment"
      RESTART IDENTITY CASCADE;
    `);

        console.log('Database cleaned');
    } catch (e) {
        console.error('DB reset error:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

reset();