const cookie = require('cookie');
const { bcrypt } = require('@root/global');
const { CustomError } = require('@utils/general');
const jwt = require('jsonwebtoken');
const {
  ValidatePhoneNumber,
  ValidateVerificationCode,
} = require('@utils/auth');
const {
  NOT_REGISTERED_YET,
  INVALID_VARIFICATION_CODE,
  VARIFICATION_CODE_HAS_BEEN_SENT,
  INVALID_PARAMETERS,
} = require('@resources/strings').userMessages;
const { verificationCache } = require('@root/global');
const { config } = require('@root/config');

exports.signUpRequestValidation = (req, res, next) => {
  ValidatePhoneNumber(req.query.phoneNumber);
  next();
};

exports.signUpCheckCache = (req, res, next) => {
  const delayTime = verificationCache.getTtl(req.query.phoneNumber);
  if (delayTime !== undefined) {
    throw new CustomError(VARIFICATION_CODE_HAS_BEEN_SENT, 403).data({
      delayTime: Math.ceil((delayTime - Date.now()) / 1000),
    });
  }
  next();
};

exports.signInRequestValidation = (req, res, next) => {
  req.phoneNumber = cookie.parse(req.headers.cookie || '').phoneNumber;
  ValidatePhoneNumber(req.phoneNumber);
  ValidateVerificationCode(req.body.VerificationCode);
  next();
};

exports.signInCheckCache = (req, res, next) => {
  req.hashedVerificationCode = verificationCache.get(req.phoneNumber);
  if (req.hashedVerificationCode === undefined) {
    throw new CustomError(NOT_REGISTERED_YET, 404);
  }
  next();
};

exports.signInValidateVerificationCode = (req, res, next) => {
  if (
    !bcrypt.compareSync(req.body.VerificationCode, req.hashedVerificationCode)
  ) {
    throw new CustomError(INVALID_VARIFICATION_CODE, 400).saveToDatabase(true);
  }
  next();
};

exports.protect = (req, res, next) => {
  // eslint-disable-next-line max-len
  // TODO - Authentication - check for bearer token in headers (authorization header must not be empty) - token also must have correct prefix
  const bearerToken = cookie
    .parse(req.headers.cookie || '')
    .JWT.split('Bearer ')[1];
  if (bearerToken === undefined) {
    throw new CustomError(INVALID_PARAMETERS, 400);
  }
  // TODO - Authentication - Verify received JWT
  try {
    const payload = jwt.verify(bearerToken, config.secrets.jwt);
  } catch (err) {
    throw new CustomError(INVALID_VARIFICATION_CODE, 400).saveToDatabase(true);
  }
  next();
  // TODO - Authentication - if verify was false throw no auth exception
};
