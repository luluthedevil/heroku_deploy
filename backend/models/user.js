module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      allowEmpty: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      allowEmpty: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      allowEmpty: false,
      validate: {
        len: [6, 100],
      },
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      allowEmpty: false,
      defaultValue: false,
    },
  });

  return User;
};
