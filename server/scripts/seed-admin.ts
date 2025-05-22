import mariadb from 'mariadb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'community_guardian',
  connectionLimit: 5,
});

async function seedAdmin() {
  const email = 'admin@example.com';
  const password = 'admin123';
  const name = 'Admin';
  const role = 'admin';

  let conn;
  try {
    conn = await pool.getConnection();
    // Check if admin already exists
    const rows = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.log('Admin user already exists.');
      return;
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Insert admin user
    await conn.query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, role]
    );
    console.log('Admin user created:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
  } catch (err) {
    console.error('Error seeding admin user:', err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

seedAdmin(); 