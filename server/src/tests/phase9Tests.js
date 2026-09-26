const assert = require('assert');
const bcrypt = require('bcryptjs');
const { generateAccessToken, verifyAccessToken } = require('../utils/tokenUtils');
const { maskUserIdentifier } = require('../utils/maskUtils');
const { validateClaimPayload } = require('../services/claimService');
const { requireRole } = require('../middleware/authorizationMiddleware');
const balanceService = require('../services/balanceService');

console.log('========================================');
console.log('RUNNING PHASE 9 BACKEND SECURITY & LOGIC TESTS');
console.log('========================================\n');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ FAIL: ${name}`);
      console.error(`  Error: ${err.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ FAIL: ${name}`);
      console.error(`  Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Password Hashing & Security Tests
  await asyncTest('1. Password Hashing Security (Bcrypt)', async () => {
    const rawPassword = 'SecurePassword123!';
    const hash = await bcrypt.hash(rawPassword, 10);
    assert.notStrictEqual(hash, rawPassword);
    assert.strictEqual(await bcrypt.compare(rawPassword, hash), true);
    assert.strictEqual(await bcrypt.compare('WrongPassword', hash), false);
  });

  // 2. JWT Generation & Verification Tests
  test('2. JWT Verification & Token Validation', () => {
    const userObj = { _id: '507f1f77bcf86cd799439011', role: 'USER' };
    const token = generateAccessToken(userObj);
    assert.ok(token);

    const decoded = verifyAccessToken(token);
    assert.strictEqual(decoded.userId, userObj._id);
    assert.strictEqual(decoded.role, userObj.role);
  });

  test('3. JWT Rejection on Invalid Token', () => {
    assert.throws(() => {
      verifyAccessToken('invalid.token.string');
    });
  });

  // 4. Role Authorization Tests
  test('4. Authorization Role Middleware (USER vs ADMIN)', () => {
    const adminMiddleware = requireRole('ADMIN');
    
    // Mock response object
    let statusSent = 0;
    let jsonSent = null;
    const resMock = {
      status: (s) => { statusSent = s; return resMock; },
      json: (j) => { jsonSent = j; return resMock; }
    };

    // User is NORMAL user
    const reqUser = { user: { role: 'USER' } };
    adminMiddleware(reqUser, resMock, () => {
      assert.fail('Should not allow normal user into ADMIN route');
    });
    assert.strictEqual(statusSent, 403);
    assert.strictEqual(jsonSent.code, 'FORBIDDEN');

    // User is ADMIN
    let nextCalled = false;
    const reqAdmin = { user: { role: 'ADMIN' } };
    adminMiddleware(reqAdmin, resMock, () => {
      nextCalled = true;
    });
    assert.strictEqual(nextCalled, true);
  });

  // 5. User Masking & Privacy Tests
  test('5. Public User Identifier Privacy Masking', () => {
    const masked1 = maskUserIdentifier('ayush@example.com');
    assert.strictEqual(masked1.startsWith('AYU****'), true);
    assert.strictEqual(masked1.length, 9);

    const masked2 = maskUserIdentifier('john.doe@veloop.io');
    assert.strictEqual(masked2.startsWith('JOH****'), true);
    assert.strictEqual(masked2.length, 9);

    assert.strictEqual(maskUserIdentifier(''), 'ANON****00');
  });

  // 6. Balance & Currency Deduction Tests
  test('6. Balance Verification Logic', () => {
    const user = { pointsBalance: 100 };
    assert.strictEqual(balanceService.hasSufficientBalance(user, 'VELOOP Points', 50), true);
    assert.strictEqual(balanceService.hasSufficientBalance(user, 'VELOOP Points', 100), true);
    assert.strictEqual(balanceService.hasSufficientBalance(user, 'VELOOP Points', 150), false);
  });

  // 7. Claim Input Validation Tests
  test('7. Physical Prize Claim Validation', () => {
    const validPhysicalPayload = {
      name: 'John Doe',
      phone: '+15551234567',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      pinCode: '10001'
    };
    // Should not throw error
    validateClaimPayload('PHYSICAL', validPhysicalPayload);

    // Missing address
    assert.throws(() => {
      validateClaimPayload('PHYSICAL', { ...validPhysicalPayload, address: '' });
    }, /address is required/i);
  });

  test('8. Digital Prize Claim Validation', () => {
    const validDigitalPayload = { email: 'winner@example.com' };
    validateClaimPayload('DIGITAL', validDigitalPayload);

    assert.throws(() => {
      validateClaimPayload('DIGITAL', { email: 'invalid-email' });
    }, /valid delivery email/i);
  });

  console.log('\n========================================');
  console.log(`TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
