class CustomError extends Error {
  name = 'CustomError';

  err = null;

  userMessage = '';

  userStatus = 500;

  saveToDatabase = true;

  data = {};

  constructor(
    error,
    userMessage,
    userStatus,
    saveToDatabase = false,
    data = {},
  ) {
    super();
    this.error = error;
    this.userMessage = userMessage;
    this.userStatus = userStatus;
    this.saveToDatabase = saveToDatabase;
    this.data = data;
    Error.captureStackTrace(this, CustomError);
  }

  // constructor() {
  //   super();
  //   Error.captureStackTrace(this, CustomError);
  // }

  error(err) {
    this.err = err;
    return this;
  }
}
module.exports = { CustomError };
