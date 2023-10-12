const { ExceptionRepository } = require('@repositories/exception');
const { CustomError } = require('@utils/general');
const { GENERAL_ERROR_MESSAGE } = require('@resources/strings').userMessages;

exports.globalErrorHandler = (err, req, res, next) => {
  let customError;
  if (err instanceof CustomError) {
    customError = err;
  } else {
    customError = new CustomError(GENERAL_ERROR_MESSAGE, 500)
      .error(err)
      .saveToDatabase(true);
  }
  if (customError.saveToDatabaseProp) {
    ExceptionRepository.insert(customError);
  }
  res
    .status(customError.userStatusProp)
    .send({ message: customError.userMessageProp, data: customError.dataProp });
  next();
};
