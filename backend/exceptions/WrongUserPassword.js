class WrongUserPassword extends Error {
  constructor(message) {
    super(message);
    this.code = 400;
  }
}

module.exports = { WrongUserPassword };
