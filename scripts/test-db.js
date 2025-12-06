// node scripts/test-db.js
import postgres from "postgres";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

async function test() {
  const res = await sql`SELECT now() AS now`;
  console.log(res);
  await sql.end();
}
test().catch(err => { console.error(err); process.exit(1) });
