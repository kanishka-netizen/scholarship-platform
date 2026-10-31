import pg from './backend/node_modules/pg/lib/index.js';
import bcrypt from './backend/node_modules/bcryptjs/index.js';
import dotenv from './backend/node_modules/dotenv/lib/main.js';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

console.log('--- DEMONSTRATION OF DATABASE PASSWORD STORAGE: BEFORE VS AFTER ---');

// 1. Before: Insecure plain-text storage (Demonstration record)
await client.query("DELETE FROM \"User\" WHERE email='demo_student@example.com'");
await client.query(`
  INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
  VALUES ('cmv_demo_before_01', 'demo_student@example.com', 'Vikram Patel', 'PlaintextStudentPass2026!', 'STUDENT', NOW(), NOW())
`);

const before = await client.query('SELECT id, email, name, password, role, "updatedAt" FROM "User" WHERE email=\'demo_student@example.com\'');
console.log('\n[BEFORE HARDENING] Insecure Plaintext Password Stored in Database:');
console.table(before.rows.map(r => ({
  email: r.email,
  name: r.name,
  password_stored: r.password,
  security_state: 'VULNERABLE (Plain text exposed to DB leakage/breach)',
})));

// 2. After: Secure Salted bcrypt hash (rounds = 12)
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash('PlaintextStudentPass2026!', salt);

await client.query(`
  UPDATE "User"
  SET password = $1, "updatedAt" = NOW()
  WHERE email = 'demo_student@example.com'
`, [hashedPassword]);

const after = await client.query('SELECT id, email, name, password, role, "updatedAt" FROM "User" WHERE email=\'demo_student@example.com\'');
console.log('\n[AFTER HARDENING] Secure Salted Bcrypt Hash Stored in Database:');
console.table(after.rows.map(r => ({
  email: r.email,
  name: r.name,
  password_stored: r.password,
  security_state: 'SECURE (Salted bcrypt hash with cost factor 12)',
})));

await client.end();
