import bcryptjs from 'bcryptjs'
import prisma from '@/lib/prisma'

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@sappura.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin User'

  if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)) {
    throw new Error('For production, set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  const hashedPassword = await bcryptjs.hash(password, 10)

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    console.log(`✅ Updated admin user: ${email}`)
  } else {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    console.log(`✅ Created admin user: ${email}`)
  }

  console.log('🔐 Admin credentials are ready for login.')
}

main()
  .catch((error) => {
    console.error('❌ Failed to create/update admin user:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
