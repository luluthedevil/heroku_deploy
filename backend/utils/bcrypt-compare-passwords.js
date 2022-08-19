const bcrypt = require('bcryptjs');

const comparePasswords = async (plainPassword, hashedPassword) => {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
};

module.exports = comparePasswords;
