const { bcrypt } = require('@root/global');
const { CustomError } = require('@utils/general');
const {
  ValidatePhoneNumber,
  ValidateVerificationCode,
} = require('@utils/auth');
const {
  NOT_REGISTERED_YET,
  INVALID_VARIFICATION_CODE,
  VARIFICATION_CODE_HAS_BEEN_SENT,
} = require('@resources/strings').userMessages;
const { verificationCache } = require('@root/global');

exports.signUpRequestValidation = (req, res, next) => {
  ValidatePhoneNumber(req.query.phoneNumber);
  next();
};

exports.signUpCheckCache = (req, res, next) => {
  const delayTime = verificationCache.get(req.query.phoneNumber);
  if (delayTime !== undefined) {
    throw new CustomError(null, VARIFICATION_CODE_HAS_BEEN_SENT, 403, false, {
      delayTime: Math.ceil((delayTime - Date.now()) / 1000),
    });
  }
  next();
};

exports.signInRequestValidation = (req, res, next) => {
  ValidatePhoneNumber(req.get('phonenumber'));
  ValidateVerificationCode(req.body.VerificationCode);
  next();
};

exports.signInCheckCache = (req, res, next) => {
  req.hashedVerificationCode = verificationCache.get(req.get('phonenumber'));
  if (req.hashedVerificationCode === undefined) {
    throw new CustomError(null, NOT_REGISTERED_YET, 404);
  }
  next();
};

exports.signInValidateVerificationCode = (req, res, next) => {
  if (
    !bcrypt.compareSync(req.body.VerificationCode, req.hashedVerificationCode)
  ) {
    throw new CustomError(null, INVALID_VARIFICATION_CODE, 400, true);
  }
  next();
};
