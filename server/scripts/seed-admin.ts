import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedAdmin() {
  const email = 'admin@example.com';
  const password = 'admin123';
  const name = 'Admin';
  const role = 'admin';

  const client = await pool.connect();
  try {
    // Check if admin already exists
    const { rows } = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      console.log('Admin user already exists.');
      return;
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Insert admin user
    await client.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
      [email, hashedPassword, name, role]
    );
    console.log('Admin user created:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
  } catch (err) {
    console.error('Error seeding admin user:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seedAdmin(); 