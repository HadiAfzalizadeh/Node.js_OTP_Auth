const Joi = require('joi');
const { CustomError } = require('@utils/general');
const { INVALID_PARAMETERS, SEND_OTP_SMS_ERROR_MESSAGE } =
  require('@resources/strings').userMessages;
const { SERVER_CACHE_ZERO } = require('@resources/strings').dataBaseMessages;
const { verificationCache } = require('@root/global');

exports.signupRequestValidation = (req, res, next) => {
  const schema = Joi.string()
    .pattern(
      new RegExp(
        '09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}|^0[0-9]{2,}[0-9]{7,}$',
      ),
    )
    .required();
  const { error } = schema.validate(req.query.phoneNumber);
  if (error) {
    throw new CustomError(error, INVALID_PARAMETERS, 400);
  }
  next();
};

exports.signUpCheckTtlZero = (req, res, next) => {
  if (verificationCache.getTtl(req.query.phoneNumber) === 0) {
    verificationCache.del(req.query.phoneNumber);
    throw new CustomError(
      (new Error().message = SERVER_CACHE_ZERO),
      SEND_OTP_SMS_ERROR_MESSAGE,
      500,
      true,
    );
  }
  next();
};

exports.signupCheckCache = (req, res, next) => {
  if (verificationCache.get(req.query.phoneNumber) !== undefined) {
    res.status(200).send({
      data: {
        delayTime: verificationCache.getTtl(req.query.phoneNumber),
      },
    });
  }
  next();
};
