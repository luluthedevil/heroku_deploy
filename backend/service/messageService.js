const db = require('../config/db.config');
const { MessageDoesNotExists, BadRequest } = require('../exceptions');
const { UserDoesNotExists } = require('../exceptions/UserDoesNotExists');

exports.create = async (message) => {
  const userFound = await db.user.findOne({
    where: {
      email: message.userEmail,
    },
  });

  if (!userFound) {
    throw new UserDoesNotExists('O usuário não existe');
  }

  const persistedMessage = await db.message.create(message);
  return persistedMessage;
};

exports.getAll = async (email) =>
  db.message.findAll({
    where: {
      userEmail: email,
    },
  });

exports.getOne = async (id) => {
  const messageFound = await db.message.findOne({
    where: {
      id,
    },
  });

  if (!messageFound) {
    throw new MessageDoesNotExists('A mensagem não existe');
  }

  return messageFound;
};

exports.update = async (messageId, userEmail, messageData) => {
  const messageFound = await db.message.findOne({
    where: {
      id: messageId,
    },
  });

  if (!messageFound) {
    throw new MessageDoesNotExists('A mensagem não existe');
  }

  if (messageFound.userEmail !== userEmail)
    throw new BadRequest('Esta mensagem não pertence a este usuário');

  await db.message.update(messageData, {
    where: {
      id: messageId,
    },
  });
};

exports.delete = async (id, userEmail) => {
  const messageFound = await db.message.findOne({
    where: {
      id,
    },
  });

  if (!messageFound) {
    throw new MessageDoesNotExists('A mensagem não existe');
  }

  if (messageFound.userEmail !== userEmail)
    throw new BadRequest('Esta mensagem não pertence a este usuário');

  await db.message.destroy({ where: { id } });
};
