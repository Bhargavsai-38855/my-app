/**
 * Validate username for Pigeon authentication (no phone numbers required)
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  const clean = username.trim().replace(/^@/, '');
  if (!clean) {
    return { valid: false, error: 'Username is required' };
  }
  if (clean.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  if (clean.length > 24) {
    return { valid: false, error: 'Username must be 24 characters or less' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true };
}

/**
 * Validate password
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 4) {
    return { valid: false, error: 'Password must be at least 4 characters' };
  }
  return { valid: true };
}

/**
 * Validate user display name
 */
export function validateDisplayName(name: string): { valid: boolean; error?: string } {
  const clean = name.trim();
  if (!clean) {
    return { valid: false, error: 'Display name is required' };
  }
  if (clean.length < 2) {
    return { valid: false, error: 'Display name must be at least 2 characters' };
  }
  return { valid: true };
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const clean = email.trim();
  if (!clean) {
    return { valid: false, error: 'Email address is required' };
  }
  // Standard permissive email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. name@domain.com)' };
  }
  return { valid: true };
}

/**
 * Format username with @ prefix
 */
export function formatUsernameHandle(input: string): string {
  const clean = input.trim().replace(/^@/, '');
  return clean ? `@${clean}` : '';
}
