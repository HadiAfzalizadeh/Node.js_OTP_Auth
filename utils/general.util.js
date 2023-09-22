class CustomError extends Error {
  constructor(error, userMessage, userStatus, saveToDatabase = false) {
    super();
    this.error = error;
    this.name = 'CustomError';
    this.userMessage = userMessage;
    this.userStatus = userStatus;
    this.saveToDatabase = saveToDatabase;
    Error.captureStackTrace(this, CustomError);
  }
}
module.exports = { CustomError };
