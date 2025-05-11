import app from './app';
import { PrismaClient } from '@prisma/client';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const prisma = new PrismaClient();

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
