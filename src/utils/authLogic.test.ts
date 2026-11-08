import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateUsername,
  validatePassword,
  validateDisplayName,
  validateEmail,
  formatUsernameHandle,
} from './authLogic';

test('validateUsername validates valid handles and strips @', () => {
  assert.equal(validateUsername('kirandhanu').valid, true);
  assert.equal(validateUsername('@kirandhanu').valid, true);
  assert.equal(validateUsername('user_123').valid, true);
  assert.equal(validateUsername('ab').valid, false);
  assert.equal(validateUsername('invalid user!').valid, false);
});

test('validateEmail validates proper email addresses', () => {
  assert.equal(validateEmail('test@example.com').valid, true);
  assert.equal(validateEmail('user.name+tag@sub.domain.co').valid, true);
  assert.equal(validateEmail('invalid-email').valid, false);
  assert.equal(validateEmail('missing@domain').valid, false);
  assert.equal(validateEmail('').valid, false);
});

test('validatePassword requires at least 4 characters', () => {
  assert.equal(validatePassword('1234').valid, true);
  assert.equal(validatePassword('securePigeonPass!').valid, true);
  assert.equal(validatePassword('123').valid, false);
  assert.equal(validatePassword('').valid, false);
});

test('validateDisplayName requires minimum 2 characters', () => {
  assert.equal(validateDisplayName('Kiran Dhanu').valid, true);
  assert.equal(validateDisplayName('K').valid, false);
  assert.equal(validateDisplayName('   ').valid, false);
});

test('formatUsernameHandle adds @ prefix cleanly', () => {
  assert.equal(formatUsernameHandle('pigeon_fan'), '@pigeon_fan');
  assert.equal(formatUsernameHandle('@pigeon_fan'), '@pigeon_fan');
  assert.equal(formatUsernameHandle(''), '');
});
