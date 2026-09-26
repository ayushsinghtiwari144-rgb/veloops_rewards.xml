/**
 * Utility to generate safe public masked user identifiers (e.g. AYU****92)
 */
const maskUserIdentifier = (usernameOrEmail = '') => {
  if (!usernameOrEmail) return 'ANON****00';

  const str = String(usernameOrEmail).trim();
  const prefix = str.substring(0, 3).toUpperCase();
  
  // Use simple hash of full string to generate consistent 2-digit suffix
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i) * 31) % 100;
  }
  const suffix = String(hash).padStart(2, '0');

  return `${prefix}****${suffix}`;
};

module.exports = {
  maskUserIdentifier
};
