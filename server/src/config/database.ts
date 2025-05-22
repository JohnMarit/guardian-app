import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

// Parse JawsDB URL if available, otherwise use local development settings
const getDbConfig = () => {
  if (process.env.JAWSDB_URL) {
    // Parse the JawsDB URL
    const url = new URL(process.env.JAWSDB_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port),
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading slash
      connectionLimit: 5,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      trace: true
    };
  }

  // Local development configuration
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'community_guardian',
    connectionLimit: 5,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    trace: true
  };
};

const pool = mariadb.createPool(getDbConfig());

export async function query<T>(sql: string, params: any[] = []): Promise<T> {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

export async function initializeDatabase() {
  let retries = 5;
  while (retries > 0) {
    try {
      // Test connection
      await query('SELECT 1');

      // Create users table
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role ENUM('admin', 'user', 'responder') NOT NULL DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Create alerts table
      await query(`
        CREATE TABLE IF NOT EXISTS alerts (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          location VARCHAR(255) NOT NULL,
          level ENUM('low', 'medium', 'high') NOT NULL,
          status ENUM('pending', 'verified', 'dismissed') NOT NULL DEFAULT 'pending',
          created_by INT NOT NULL,
          verified_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id),
          FOREIGN KEY (verified_by) REFERENCES users(id)
        )
      `);

      console.log('Database initialized successfully');
      return;
    } catch (error) {
      console.error(`Database initialization attempt ${6 - retries} failed:`, error);
      retries--;
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }
} 