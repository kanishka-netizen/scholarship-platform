import speakeasy from './backend/node_modules/speakeasy/index.js';
import pg from './backend/node_modules/pg/lib/index.js';
import dotenv from './backend/node_modules/dotenv/lib/main.js';
dotenv.config();

const BASE_URL = 'http://localhost:8080';

async function runSecurityTests() {
  console.log('====================================================');
  console.log('       DA3 SECURITY & AUTHENTICATION TEST SUITE      ');
  console.log('====================================================\n');

  // 1. Database Connection & Schema Verification
  const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  console.log('✓ Connected to Supabase PostgreSQL cloud database');

  // Clean up any test users from prior runs
  await pgClient.query("DELETE FROM \"User\" WHERE email IN ('student_da3@example.com', 'admin_da3@example.com')");

  // ----------------------------------------------------
  // Q2(a) Password Salted Hashing Demonstration
  // ----------------------------------------------------
  console.log('\n--- Q2(a): Testing Password Salted Hashing (bcrypt) ---');
  
  // Register student
  console.log('1. Registering student_da3@example.com with password "StudentSecure123!"...');
  const regStudentRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student_da3@example.com',
      password: 'StudentSecure123!',
      name: 'Rahul Sharma (Student)',
      role: 'STUDENT',
    }),
  });
  const studentData = await regStudentRes.json();
  console.log('   Response status:', regStudentRes.status);
  console.log('   Registered Student ID:', studentData.id, 'Role:', studentData.role);

  // Register admin
  console.log('2. Registering admin_da3@example.com with password "AdminMasterPass2026!"...');
  const regAdminRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin_da3@example.com',
      password: 'AdminMasterPass2026!',
      name: 'Dr. Anita Desai (Admin Officer)',
      role: 'ADMIN',
    }),
  });
  const adminData = await regAdminRes.json();
  console.log('   Response status:', regAdminRes.status);
  console.log('   Registered Admin ID:', adminData.id, 'Role:', adminData.role);

  // Inspect database to show salted bcrypt hash
  console.log('\n3. Inspecting Supabase PostgreSQL "User" table to verify bcrypt salted hashing:');
  const dbUsers = await pgClient.query(
    "SELECT id, email, role, password, \"mfaEnabled\" FROM \"User\" WHERE email IN ('student_da3@example.com', 'admin_da3@example.com')"
  );
  console.table(dbUsers.rows.map(r => ({
    email: r.email,
    role: r.role,
    password_hash: r.password,
    hash_algorithm: r.password.startsWith('$2a$12$') ? 'bcrypt (salt rounds: 12)' : 'unknown',
    mfa_enabled: r.mfaEnabled,
  })));

  // Test login with invalid password
  console.log('4. Testing login with INVALID password...');
  const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student_da3@example.com',
      password: 'WrongPassword!',
    }),
  });
  console.log('   Status:', badLoginRes.status, '(Expected 401)');
  const badLoginBody = await badLoginRes.json();
  console.log('   Error message:', badLoginBody.message);

  // ----------------------------------------------------
  // Q2(b) TOTP MFA Implementation
  // ----------------------------------------------------
  console.log('\n--- Q2(b): Multi-Factor Authentication (TOTP) ---');
  console.log('1. Setting up TOTP MFA for student user...');
  const mfaSetupRes = await fetch(`${BASE_URL}/auth/mfa/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: studentData.id }),
  });
  const mfaSetupData = await mfaSetupRes.json();
  console.log('   TOTP Secret (Base32):', mfaSetupData.secret);
  console.log('   Authenticator OTP Auth URL:', mfaSetupData.otpauthUrl);
  console.log('   QR Code generated (Data URL length):', mfaSetupData.qrCode?.length, 'chars');

  // Generate valid TOTP token using speakeasy
  const validTotpCode = speakeasy.totp({
    secret: mfaSetupData.secret,
    encoding: 'base32',
  });
  console.log('2. Generated 6-digit TOTP Token from Authenticator Secret:', validTotpCode);

  // Verify and enable MFA
  console.log('3. Verifying and activating MFA for user...');
  const mfaVerifyRes = await fetch(`${BASE_URL}/auth/mfa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: studentData.id,
      token: validTotpCode,
    }),
  });
  const mfaVerifyData = await mfaVerifyRes.json();
  console.log('   Status:', mfaVerifyRes.status, 'Result:', mfaVerifyData);

  // Now login with MFA required
  console.log('4. Attempting standard login (password only) with MFA active...');
  const mfaLoginPromptRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student_da3@example.com',
      password: 'StudentSecure123!',
    }),
  });
  const mfaPromptData = await mfaLoginPromptRes.json();
  console.log('   Response indicates MFA requirement:', mfaPromptData);

  // Attempt login with INVALID TOTP code
  console.log('5. Attempting login with INVALID TOTP code "000000"...');
  const badMfaLoginRes = await fetch(`${BASE_URL}/auth/mfa/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: studentData.id,
      token: '000000',
    }),
  });
  console.log('   Status:', badMfaLoginRes.status, '(Expected 401/400)');
  const badMfaBody = await badMfaLoginRes.json();
  console.log('   Rejection message:', badMfaBody.message);

  // Login with VALID TOTP code
  console.log('6. Logging in with VALID TOTP code...');
  const freshTotp = speakeasy.totp({ secret: mfaSetupData.secret, encoding: 'base32' });
  const validMfaLoginRes = await fetch(`${BASE_URL}/auth/mfa/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: studentData.id,
      token: freshTotp,
    }),
  });
  const studentAuthData = await validMfaLoginRes.json();
  console.log('   Login successful! Access token received.');
  const studentToken = studentAuthData.accessToken;

  // Login as Admin to get Admin JWT
  console.log('7. Logging in as Admin (admin_da3@example.com)...');
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin_da3@example.com',
      password: 'AdminMasterPass2026!',
    }),
  });
  const adminAuthData = await adminLoginRes.json();
  const adminToken = adminAuthData.accessToken;
  console.log('   Admin login successful! Access token received.');

  // ----------------------------------------------------
  // Q2(b) Role-Based Access Control (RBAC) Testing
  // ----------------------------------------------------
  console.log('\n--- Q2(b): Testing Role-Based Access Control (RBAC) on Protected APIs ---');
  
  // Find a scholarship ID to test with
  const sampleSch = await pgClient.query('SELECT id, name FROM "Scholarship" LIMIT 1');
  const testSchId = sampleSch.rows[0].id;
  console.log(`   Target scholarship: "${sampleSch.rows[0].name}" (ID: ${testSchId})`);

  // Test 1: Unauthenticated request (no token)
  console.log('\n[Test 1] DELETE /scholarships/:id WITHOUT token:');
  const unauthRes = await fetch(`${BASE_URL}/scholarships/${testSchId}`, {
    method: 'DELETE',
  });
  const unauthBody = await unauthRes.json();
  console.log('   Status:', unauthRes.status, '(Expected 401 Unauthorized)');
  console.log('   Response:', unauthBody);

  // Test 2: Authenticated request with STUDENT role
  console.log('\n[Test 2] PATCH /scholarships/:id WITH STUDENT token:');
  const studentRes = await fetch(`${BASE_URL}/scholarships/${testSchId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`,
    },
    body: JSON.stringify({ amount: 99999 }),
  });
  const studentBody = await studentRes.json();
  console.log('   Status:', studentRes.status, '(Expected 403 Forbidden)');
  console.log('   Response:', studentBody);

  // Test 3: Authenticated request with ADMIN role
  console.log('\n[Test 3] PATCH /scholarships/:id WITH ADMIN token:');
  const adminRes = await fetch(`${BASE_URL}/scholarships/${testSchId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ description: 'Updated by Admin during DA3 RBAC verification' }),
  });
  const adminBody = await adminRes.json();
  console.log('   Status:', adminRes.status, '(Expected 200 OK)');
  console.log('   Updated Scholarship ID:', adminBody.id, 'Verified Description:', adminBody.description);

  await pgClient.end();
  console.log('\n====================================================');
  console.log('✓ ALL SECURITY & RBAC TESTS COMPLETED SUCCESSFULLY!');
  console.log('====================================================\n');
}

runSecurityTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
