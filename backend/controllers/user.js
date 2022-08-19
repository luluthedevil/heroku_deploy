const logger = require('pino')();
const userService = require('../service/userService');
const { UserAlreadyExists } = require('../exceptions/UserAlreadyExists');
const {
  VerifyTokenEmailFailed,
  UserDoesNotExists,
  WrongUserPassword,
  UserNotVerified,
} = require('../exceptions');

exports.create = async (req, res) => {
  let persistedUser;

  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };

    persistedUser = await userService.create(user);
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      return res
        .status(error.code)
        .json({ message: error.message, code: error.code });
    }
    logger.error(error);
  }

  const presentationUser = {
    id: persistedUser.id,
    email: persistedUser.email,
    username: persistedUser.username,
    verified: persistedUser.verified,
  };

  return res.status(200).json(presentationUser);
};

exports.getAll = async (req, res) => {
  const users = await userService.getAll();

  return res.status(200).json(users);
};

exports.getOne = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ message: 'Id de usuário não informado', code: 400 });
  }

  let userFound;
  try {
    userFound = await userService.getOne(req.params.id);
  } catch (error) {
    if (error instanceof UserDoesNotExists) {
      return res
        .status(error.code)
        .json({ message: error.message, code: error.code });
    }
  }

  return res.status(200).json(userFound);
};

exports.update = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ message: 'Id de usuário não informado', code: 400 });
  }

  Object.keys(req.body).forEach((key) => {
    if (!req.body[key]) {
      delete req.body[key];
    }
  });

  let updatedUser;
  try {
    updatedUser = await userService.update(req.params.id, req.body);
  } catch (error) {
    if (error instanceof UserDoesNotExists) {
      return res
        .status(error.code)
        .json({ message: error.message, code: error.code });
    }

    logger.error(error);
  }

  const presentationUser = {
    id: updatedUser.id,
    email: updatedUser.email,
    username: updatedUser.username,
    verified: updatedUser.verified,
  };

  return res.status(200).json(presentationUser);
};

exports.delete = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ message: 'Id de usuário não informado', code: 400 });
  }

  try {
    await userService.delete(req.params.id);
  } catch (error) {
    if (error instanceof UserDoesNotExists) {
      return res
        .status(error.code)
        .json({ message: error.message, code: error.code });
    }
  }

  return res.status(204).send();
};

exports.verifyAccount = async (req, res) => {
  const { token } = req.params;

  if (!token)
    return res.status(401).json({ auth: false, message: 'No token provided.' });

  try {
    await userService.verifyAccount(token);
  } catch (error) {
    if (error instanceof VerifyTokenEmailFailed) {
      return res
        .status(error.code)
        .json({ message: error.message, code: error.code });
    }
    logger.error(error);
  }

  return res
    .status(200)
    .json({ message: 'Sua conta foi verificada com sucesso!' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email ou senha não presente.' });

  let token;

  try {
    token = await userService.login(email, password);
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
    if (error instanceof UserNotVerified) {
      return res
        .status(error.code)
        .json({ message: error.message, code: error.code });
    }
    logger.error(error);
  }

  return res.status(200).json({ token });
};
