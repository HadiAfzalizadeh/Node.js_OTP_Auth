const { ExceptionRepository } = require('../repositories/exception.repository');
const { CustomError } = require('../utils/general.util');
const { GENERAL_ERROR_MESSAGE } =
  require('../resources/strings.resource').userMessages;

const exceptionRepository = new ExceptionRepository();

exports.globalErrorHandler = (err, req, res, next) => {
  let customError;
  if (err instanceof CustomError) {
    customError = err;
  } else {
    customError = new CustomError(err, GENERAL_ERROR_MESSAGE, 500, true);
  }
  if (customError.saveToDatabase) {
    exceptionRepository.insert(customError);
  }
  res.status(customError.userStatus).send({ message: customError.userMessage });
};
