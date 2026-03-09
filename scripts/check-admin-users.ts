import prisma from '@/lib/prisma'

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  console.log('Admin users:', users)
}

main()
  .catch((error) => {
    console.error('Failed to read users:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
