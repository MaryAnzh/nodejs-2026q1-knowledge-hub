import { PrismaClient, Role, ArticleStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Users
  const admin = await prisma.user.create({
    data: {
      login: 'admin',
      password: 'admin123',
      role: Role.ADMIN,
    },
  });

  const editor = await prisma.user.create({
    data: {
      login: 'editor',
      password: 'editor123',
      role: Role.EDITOR,
    },
  });

  const editor2 = await prisma.user.create({
    data: {
      login: 'editor2',
      password: 'editor2123',
      role: Role.EDITOR,
    },
  });

  const viewer = await prisma.user.create({
    data: {
      login: 'viewer',
      password: 'viewer123',
      role: Role.VIEWER,
    },
  });

  // Categories
  await prisma.category.createMany({
    data: [
      { name: 'Tech', description: 'Technology news and articles' },
      { name: 'Science', description: 'Scientific discoveries' },
      { name: 'Lifestyle', description: 'Life and style' },
    ],
  });

  // Tags
  await prisma.tag.createMany({
    data: [
      { name: 'javascript' },
      { name: 'nodejs' },
      { name: 'prisma' },
      { name: 'docker' },
      { name: 'database' },
    ],
  });

  // Fetch tags for relations
  const allTags = await prisma.tag.findMany();

  // Fetch categories
  const tech = await prisma.category.findFirst({ where: { name: 'Tech' } });
  const science = await prisma.category.findFirst({ where: { name: 'Science' } });
  const lifestyle = await prisma.category.findFirst({ where: { name: 'Lifestyle' } });

  // 1 — Published (admin)
  const article1 = await prisma.article.create({
    data: {
      title: 'Intro to Prisma',
      content: 'Prisma is a modern ORM...',
      status: ArticleStatus.PUBLISHED,
      authorId: admin.id,
      categoryId: tech?.id,
      tags: {
        connect: allTags.slice(0, 2).map((t) => ({ id: t.id })),
      },
    },
  });

  // 2 — Draft (editor) — no comments
  const article2 = await prisma.article.create({
    data: {
      title: 'Docker Basics',
      content: 'Docker is a containerization tool...',
      status: ArticleStatus.DRAFT,
      authorId: editor.id,
      categoryId: tech?.id,
      tags: {
        connect: allTags.slice(2, 4).map((t) => ({ id: t.id })),
      },
    },
  });

  // 3 — Published (editor2)
  const article3 = await prisma.article.create({
    data: {
      title: 'Node.js Basics',
      content: 'Node.js is a JavaScript runtime...',
      status: ArticleStatus.PUBLISHED,
      authorId: editor2.id,
      categoryId: tech?.id,
      tags: {
        connect: allTags.slice(0, 2).map((t) => ({ id: t.id })),
      },
    },
  });

  // 4 — Archived (editor2)
  const article4 = await prisma.article.create({
    data: {
      title: 'Quantum Physics Overview',
      content: 'Quantum physics explores the behavior of matter...',
      status: ArticleStatus.ARCHIVED,
      authorId: editor2.id,
      categoryId: science?.id,
      tags: {
        connect: allTags.slice(1, 4).map((t) => ({ id: t.id })),
      },
    },
  });

  // 5 — Published (editor)
  const article5 = await prisma.article.create({
    data: {
      title: 'Healthy Lifestyle Tips',
      content: 'A healthy lifestyle includes balanced nutrition...',
      status: ArticleStatus.PUBLISHED,
      authorId: editor.id,
      categoryId: lifestyle?.id,
      tags: {
        connect: allTags.slice(3, 5).map((t) => ({ id: t.id })),
      },
    },
  });

  await prisma.comment.createMany({
    data: [
      { content: 'Great article!', authorId: admin.id, articleId: article3.id },
      { content: 'Very helpful!', authorId: editor2.id, articleId: article1.id },
      { content: 'Not bad', authorId: editor.id, articleId: article1.id },
      { content: 'Nice intro!', authorId: viewer.id, articleId: article3.id },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });