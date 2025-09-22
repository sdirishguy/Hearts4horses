import { PrismaClient } from '@prisma/client';

// In development it is useful to attach the Prisma client to the globalThis
// object to prevent creating a new connection on every hot reload. In
// production a new client is created per import to avoid leaking state.
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;