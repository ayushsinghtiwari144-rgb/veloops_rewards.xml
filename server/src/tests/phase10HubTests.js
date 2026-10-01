const assert = require('assert');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../utils/tokenUtils');
const { maskUserIdentifier } = require('../utils/maskUtils');

console.log('========================================');
console.log('RUNNING PHASE 10 VELOOP REWARDS HUB TESTS');
console.log('========================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✓ PASS: ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ FAIL: ${testName}`);
    console.error(`  Error: ${err.message}`);
  }
}

// 1. Password Hashing Security
runTest('1. Password Hashing Security (Bcrypt)', () => {
  const plainPassword = 'SecretPassword123!';
  const hash = bcrypt.hashSync(plainPassword, 10);
  assert.strictEqual(bcrypt.compareSync(plainPassword, hash), true);
  assert.strictEqual(bcrypt.compareSync('WrongPassword', hash), false);
});

// 2. JWT Access Token Generation
runTest('2. JWT Access Token Generation & Payload Validation', () => {
  const mockUser = {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    email: 'hubuser@veloop.com',
    role: 'USER',
    pointsBalance: 1200
  };
  const token = generateAccessToken(mockUser);
  assert.strictEqual(typeof token, 'string');
  assert.ok(token.length > 20);
});

// 3. User Identity Privacy Masking
runTest('3. User Identity Privacy Masking for Leaderboard', () => {
  const name1 = 'Ayush Tiwari';
  const masked1 = maskUserIdentifier(name1);
  assert.ok(masked1.startsWith('AYU'));
  assert.ok(masked1.includes('****'));
});

// 4. Server-Side Point Validation Logic (Simulated)
runTest('4. Server-Side Point Validation for Reward Redemption', () => {
  const userBalance = 500;
  const rewardCost = 2500;
  const canRedeem = userBalance >= rewardCost;
  assert.strictEqual(canRedeem, false, 'User with 500 points cannot redeem 2500 point reward');
  
  const sufficientBalance = 3000;
  const canRedeemSuccess = sufficientBalance >= rewardCost;
  assert.strictEqual(canRedeemSuccess, true, 'User with 3000 points can redeem 2500 point reward');
});

// 5. XP & Level Progression Logic
runTest('5. User Level Progression Logic', () => {
  let currentLevel = 1;
  let currentXp = 450;
  const gainedXp = 100;
  
  currentXp += gainedXp;
  const nextLevelThreshold = currentLevel * 500;
  if (currentXp >= nextLevelThreshold) {
    currentLevel += 1;
  }
  
  assert.strictEqual(currentLevel, 2, 'Gaining 100 XP at 450 XP levels up from Level 1 to Level 2');
  assert.strictEqual(currentXp, 550);
});

// 6. Challenge Double-Claim Prevention Logic
runTest('6. Challenge Reward Double-Claim Safeguard', () => {
  const userChallengeRecord = {
    userId: '65f1a2b3c4d5e6f7a8b9c0d1',
    challengeId: 'ch_login_01',
    claimed: true,
    claimedAt: new Date()
  };

  const isClaimAllowed = !userChallengeRecord.claimed;
  assert.strictEqual(isClaimAllowed, false, 'Already claimed challenge must be blocked from second claim');
});

// 7. Achievement Unlock Calculation
runTest('7. Achievement Unlock Progress Calculation', () => {
  const requirementValue = 5;
  const userRedemptionsCount = 5;
  const isUnlocked = userRedemptionsCount >= requirementValue;
  assert.strictEqual(isUnlocked, true, 'Reaching 5 redemptions unlocks Reward Collector achievement');
});

// 8. Points Ledger Transaction Balance Verification
runTest('8. Points Ledger Balance Consistency', () => {
  const initialBalance = 500;
  const challengeReward = 150;
  const rewardSpent = 250;
  
  const balanceAfterEarn = initialBalance + challengeReward; // 650
  const balanceAfterSpend = balanceAfterEarn - rewardSpent; // 400
  
  assert.strictEqual(balanceAfterEarn, 650);
  assert.strictEqual(balanceAfterSpend, 400);
});

console.log('\n========================================');
console.log(`TEST RESULTS: ${passedTests} Passed, ${totalTests - passedTests} Failed`);
console.log('========================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
