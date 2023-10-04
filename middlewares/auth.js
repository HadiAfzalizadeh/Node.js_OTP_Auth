const Joi = require('joi');
const { bcrypt } = require('@root/global');
const { CustomError } = require('@utils/general');
const { phoneNumberValidation } = require('@utils/auth');
const {
  INVALID_PARAMETERS,
  NOT_REGISTERED_YET,
  INVALIDـVARIFICATION_CODE,
  VARIFICATION_CODE_HAS_BEEN_SENT,
} = require('@resources/strings').userMessages;
const { verificationCache } = require('@root/global');

exports.signUpRequestValidation = (req, res, next) => {
  const { error } = phoneNumberValidation(req.query.phoneNumber);
  if (error) {
    throw new CustomError(error, INVALID_PARAMETERS, 400);
  }
  next();
};

exports.signUpCheckCache = (req, res, next) => {
  if (verificationCache.get(req.query.phoneNumber) !== undefined) {
    throw new CustomError(null, VARIFICATION_CODE_HAS_BEEN_SENT, 403, false);
  }
  next();
};

exports.signInRequestValidation = (req, res, next) => {
  const { error } = phoneNumberValidation.validate(req.get('PhoneNumber'));
  if (error) {
    throw new CustomError(error, INVALID_PARAMETERS, 400);
  }
  next();
};

exports.signInCheckCache = (req, res, next) => {
  const hashedVerificationCode = verificationCache.get(req.get('PhoneNumber'));
  if (hashedVerificationCode === undefined) {
    throw new CustomError(null, NOT_REGISTERED_YET, 404);
  }
  next();
};

exports.signInValidateVerificationCode = (req, res, next) => {
  const hashedVerificationCode = verificationCache.get(req.get('PhoneNumber'));
  if (!bcrypt.compareSync(req.body.VerificationCode, hashedVerificationCode)) {
    throw new CustomError(null, INVALIDـVARIFICATION_CODE, 400, true);
  }
  next();
};
