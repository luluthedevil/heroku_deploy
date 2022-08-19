const logger = require('pino')();
const {
  UserDoesNotExists,
  MessageDoesNotExists,
  BadRequest,
} = require('../exceptions');
const messageService = require('../service/messageService');

exports.getAll = async (req, res) => {
  try {
    const all = await messageService.getAll(req.params.email);

    return res.status(200).json(all);
  } catch (error) {
    logger.info(error);
    return res.status(500).json(error);
  }
};

exports.create = async (req, res) => {
  let persistedMessage;

  const message = {
    title: req.body.title,
    content: req.body.content,
    userEmail: req.body.userEmail,
  };

  if (!message.title || !message.content || !message.userEmail)
    return res
      .status(400)
      .json({ message: 'Um ou mais campos inválidos', code: 400 });

  if (req.userEmail !== message.userEmail)
    return res.status(400).json({
      message: 'O email fornecido difere do email autenticado',
      code: 401,
    });

  try {
    persistedMessage = await messageService.create(message);
  } catch (error) {
    logger.error(error);
    if (error instanceof UserDoesNotExists) {
      return res.status(400).json({ message: error.message, code: error.code });
    }
  }

  return res.status(201).json(persistedMessage);
};

exports.getOne = async (req, res) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: 'Id de mensagem não informado', code: 400 });
    }

    const message = await messageService.getOne(req.params.id);

    return res.status(200).json(message);
  } catch (error) {
    if (error instanceof MessageDoesNotExists) {
      return res.status(400).json({ message: error.message, code: error.code });
    }

    logger.info(error);

    return res.status(500).json(error);
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: 'Id de mensagem não informado', code: 400 });
    }

    await messageService.update(req.params.id, req.userEmail, req.body);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof MessageDoesNotExists) {
      return res.status(400).json({ message: error.message, code: error.code });
    }

    if (error instanceof BadRequest) {
      return res.status(401).json({ message: error.message, code: error.code });
    }

    logger.info(error);

    return res.status(500).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: 'Id de mensagem não informado', code: 400 });
    }

    await messageService.delete(req.params.id, req.userEmail);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof MessageDoesNotExists) {
      return res.status(400).json({ message: error.message, code: error.code });
    }

    if (error instanceof BadRequest) {
      return res.status(401).json({ message: error.message, code: error.code });
    }

    logger.info(error);

    return res.status(500).json(error);
  }
};
