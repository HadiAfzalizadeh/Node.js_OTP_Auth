class CustomError extends Error {
  constructor(userMessage, userStatus) {
    super();
    this.userMessageProp = userMessage;
    this.userStatusProp = userStatus;
    this.name = 'CustomError';
    this.errorProp = null;
    this.saveToDatabaseProp = false;
    this.dataProp = {};
    Error.captureStackTrace(this, CustomError);
  }

  error(error) {
    this.errorProp = error;
    return this;
  }

  userMessage(userMessage) {
    this.userMessageProp = userMessage;
    return this;
  }

  userStatus(userStatus) {
    this.userStatusProp = userStatus;
    return this;
  }

  saveToDatabase(saveToDatabase) {
    this.saveToDatabaseProp = saveToDatabase;
    return this;
  }

  data(data) {
    this.dataProp = data;
    return this;
  }
}

module.exports = { CustomError };
