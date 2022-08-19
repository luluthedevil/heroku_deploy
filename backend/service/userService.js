const bcrypt = require('bcryptjs');
const logger = require('pino')();

const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const {
  UserAlreadyExists,
  UserDoesNotExists,
  VerifyTokenEmailFailed,
  UserNotVerified,
  WrongUserPassword,
} = require('../exceptions');

const sgMail = require('../config/email.config');
const comparePasswords = require('../utils/bcrypt-compare-passwords');

exports.create = async (user) => {
  const userFound = await db.user.findOne({
    where: {
      email: user.email,
    },
  });

  if (userFound !== null) {
    throw new UserAlreadyExists('O usuário já existe');
  }

  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  const newUser = { ...user };
  newUser.password = hashedPassword;

  const persistedUser = await db.user.create(newUser);
  const token = jwt.sign(
    { id: persistedUser.id, email: persistedUser.email },
    process.env.SECRET,
    {
      expiresIn: 3600,
    }
  );

  const msg = {
    to: persistedUser.email,
    from: 'paulojunior9395@gmail.com',
    subject: 'Verifique o seu email - Projeto PW1',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<h2>Email</h2>
    <b>Por favor, verifique o seu email para fazer login: </b><br><br>
    <a href="http://localhost:5005/users/verifyAccount/${token}">Verificar email</a>
    `,
  };

  try {
    sgMail.send(msg);
  } catch (error) {
    logger.error(error);
  }

  return persistedUser;
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

exports.getOne = async (id) => {
  const user = await db.user.findOne({ where: { id } });

  if (!user) {
    throw new UserDoesNotExists(`O usuário de id ${id} não existe`);
  }

  const finalUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    verified: user.verified,
  };

  return finalUser;
};

exports.verifyAccount = async (token) => {
  let userId;

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err)
      throw new VerifyTokenEmailFailed(
        `Falha na autenticação do token: ${err}`
      );

    userId = decoded.id;
  });

  const user = await db.user.findOne({ where: { id: userId } });
  if (!user)
    throw new VerifyTokenEmailFailed(
      `Falha na autenticação do token: O usuário não existe`
    );

  user.verified = true;
  return user.save();
};

exports.update = async (id, user) => {
  const userFound = await db.user.findOne({ where: { id } });

  if (!user) {
    throw new UserDoesNotExists(`O usuário de id ${id} não existe`);
  }

  // // Garantir que o email não será atualizado, pois é único
  // if (user.email) {
  //   user.email = userFound.email;
  // }

  // Caso o usuário passe no formulário, garanta que não mexa no campo
  if (user.verified) {
    user.verified = false;
  }

  if (user.password) {
    const salt = await bcrypt.genSalt(8);
    const newHashedPassword = await bcrypt.hash(user.password, salt);
    user.password = newHashedPassword;
  }

  return userFound.update(user, { where: { id } });
};

exports.delete = async (id) => {
  const user = await db.user.findOne({ where: { id } });

  if (!user) {
    throw new UserDoesNotExists(`O usuário de id ${id} não existe`);
  }

  await user.destroy();
};

exports.login = async (email, password) => {
  const userFound = await db.user.findOne({
    where: {
      email,
    },
  });

  if (!userFound) {
    throw new UserDoesNotExists(`O usuário de email: {${email}} não existe`);
  }

  // Compare incoming password with unhashed bcrypt password
  if (!(await comparePasswords(password, userFound.password))) {
    throw new WrongUserPassword(`A senha está incorreta`);
  }

  const token = jwt.sign(
    { id: userFound.id, email: userFound.email },
    process.env.SECRET,
    {
      expiresIn: 3600,
    }
  );

  // If user not verified, send a confirmation email again
  if (!userFound.verified) {
    const msg = {
      to: userFound.email,
      from: 'paulojunior9395@gmail.com',
      subject: 'Verifique o seu email - Projeto PW1',
      text: 'and easy to do anywhere, even with Node.js',
      html: `<h2>Email</h2>
      <b>Por favor, verifique o seu email para fazer login: </b><br><br>
      <a href="http://localhost:5005/users/verifyAccount/${token}">Verificar email</a>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      logger.error(error);
    }

    throw new UserNotVerified(
      `O usuário ${userFound.email} não está verificado. Foi enviado um email de verificação`
    );
  }

  return token;
};
