import pg from "pg"

const { Pool } = pg

// Object through which you can access the database
const pool = new Pool({ connectionString: process.env.DATABASE_URL, })

export default pool