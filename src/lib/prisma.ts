import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
  var pgPool: pg.Pool | undefined
}

// Create PostgreSQL connection pool (reuse in development)
if (!global.pgPool) {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/Sappuradb'
  global.pgPool = new Pool({ connectionString })
}

const adapter = new PrismaPg(global.pgPool)

// Create Prisma Client with adapter
export const prisma = global.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
