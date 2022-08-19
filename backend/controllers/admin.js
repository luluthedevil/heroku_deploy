const logger = require('pino')();
const adminService = require('../service/adminService');
const { UserDoesNotExists, WrongUserPassword } = require('../exceptions');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email ou senha não presente.' });

  let token;

  try {
    token = await adminService.login(email, password);
  } catch (error) {
    if (error instanceof UserDoesNotExists) {
      return res
        .status(error.code)
        .json({ message: error.message, code: error.code });
    }
    if (error instanceof WrongUserPassword) {
      return res
        .status(error.code)
        .json({ message: error.message, code: error.code });
    }
    logger.error(error);
  }

  return res.status(200).json({ token, isAdmin: true });
};
