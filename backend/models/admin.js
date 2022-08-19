module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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
  });

  return Admin;
};
