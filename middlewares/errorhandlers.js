const { ExceptionRepository } = require('@repositories/exception');
const { CustomError } = require('@utils/general');
const { GENERAL_ERROR_MESSAGE } = require('@resources/strings').userMessages;

exports.globalErrorHandler = (err, req, res, next) => {
  let customError;
  if (err instanceof CustomError) {
    customError = err;
  } else {
    customError = new CustomError(err, GENERAL_ERROR_MESSAGE, 500, true);
  }
  if (customError.saveToDatabase) {
    ExceptionRepository.insert(customError);
  }
  res.status(customError.userStatus).send({ message: customError.userMessage });
  next();
};
