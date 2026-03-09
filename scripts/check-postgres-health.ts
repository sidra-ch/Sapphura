import pg from 'pg'

const { Pool } = pg

async function main() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/Sappuradb'
  const pool = new Pool({ connectionString })

  try {
    const dbCheck = await pool.query('SELECT current_database() AS db, current_schema() AS schema, version()')
    const row = dbCheck.rows[0]
    console.log('✅ Connected to PostgreSQL')
    console.log('Database:', row.db)
    console.log('Schema:', row.schema)

    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `)

    const tableNames = tables.rows.map((t) => t.table_name)
    console.log('Tables:', tableNames)

    const required = ['User', 'Product', 'Order', 'OrderItem', 'Customer', 'Category', 'Review', 'Coupon', 'Wishlist', 'PasswordReset']
    const missing = required.filter((name) => !tableNames.includes(name))

    if (missing.length > 0) {
      console.log('❌ Missing tables:', missing)
    } else {
      console.log('✅ All required tables exist')
    }

    if (tableNames.includes('User')) {
      const users = await pool.query('SELECT id, email, role, "createdAt" FROM "User" ORDER BY "createdAt" DESC LIMIT 10;')
      console.log('User rows:', users.rows)
    }
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error('PostgreSQL health check failed:', error)
  process.exit(1)
})
