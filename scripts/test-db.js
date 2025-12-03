// node scripts/test-db.js
import postgres from "postgres";
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

async function test() {
  const res = await sql`SELECT now() AS now`;
  console.log(res);
  await sql.end();
}
test().catch(err => { console.error(err); process.exit(1) });