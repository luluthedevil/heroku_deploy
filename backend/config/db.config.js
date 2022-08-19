const bcrypt = require('bcryptjs');
const logger = require('pino')();
const { Sequelize } = require('sequelize');

// Models
const message = require('../models/message');
const user = require('../models/user');
const admin = require('../models/admin');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Adding the models
db.message = message(sequelize, Sequelize);
db.user = user(sequelize, Sequelize);
db.admin = admin(sequelize, Sequelize);

db.sync = async () => {
  await sequelize.sync();
  logger.info('Sincronizado');

  const adminFound = await db.admin.findOne({
    where: {
      email: process.env.ADMIN_EMAIL,
    },
  });

  if (!adminFound) {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    db.admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });
  }
};

// Limpar os usuários não verificados a cada 1H
setInterval(async () => {
  await db.user.destroy({
    where: {
      verified: false,
    },
  });
}, 3600 * 1000);

module.exports = db;
