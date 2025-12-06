// Load environment variables from .env file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

envLines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').trim();
    if (value) {
      process.env[key.trim()] = value;
    }
  }
});

async function initDatabase() {
  const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

  try {
    console.log('Connecting to database...');

    // Read the SQL file
    const sqlFile = path.join(__dirname, 'init-db.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    console.log('Executing schema...');

    // Execute the SQL
    await sql.unsafe(sqlContent);

    console.log('Database initialized successfully!');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

initDatabase();
