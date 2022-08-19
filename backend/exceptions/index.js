const { UserAlreadyExists } = require('./UserAlreadyExists');
const { UserDoesNotExists } = require('./UserDoesNotExists');
const { VerifyTokenEmailFailed } = require('./VerifyTokenEmailFailed');
const { UserNotVerified } = require('./UserNotVerified');
const { WrongUserPassword } = require('./WrongUserPassword');
const { BadRequest } = require('./BadRequest');
const { MessageDoesNotExists } = require('./MessageDoesNotExists');
const { NotAuthorized } = require('./NotAuthorized');

module.exports = {
  UserAlreadyExists,
  UserDoesNotExists,
  VerifyTokenEmailFailed,
  UserNotVerified,
  WrongUserPassword,
  BadRequest,
  MessageDoesNotExists,
  NotAuthorized,
};
