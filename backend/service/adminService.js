const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const { UserDoesNotExists, WrongUserPassword } = require('../exceptions');

const comparePasswords = require('../utils/bcrypt-compare-passwords');

exports.login = async (email, password) => {
  const adminFound = await db.admin.findOne({
    where: {
      email,
    },
  });

  if (!adminFound) {
    throw new UserDoesNotExists(`O admin de email: {${email}} não existe`);
  }

  // Compare incoming password with unhashed bcrypt password
  if (!(await comparePasswords(password, adminFound.password))) {
    throw new WrongUserPassword(`A senha do admin está incorreta`);
  }

  const token = jwt.sign(
    { id: adminFound.id, email: adminFound.email },
    process.env.SECRET,
    {
      expiresIn: 3600,
    }
  );

  return token;
};

exports.getAll = async () => {
  const users = await db.user.findAll();

  const finalUsers = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    verified: user.verified,
  }));

  return finalUsers;
};
