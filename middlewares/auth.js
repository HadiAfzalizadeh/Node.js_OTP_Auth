const Joi = require('joi');
const { bcrypt } = require('@root/global');
const { CustomError } = require('@utils/general');
const {
  INVALID_PARAMETERS,
  NOT_REGISTERED_YET,
  INVALIDـVARIFICATION_CODE,
  VARIFICATION_CODE_IS_ALREADY_SENT,
} = require('@resources/strings').userMessages;
const { verificationCache } = require('@root/global');

exports.signUpRequestValidation = (req, res, next) => {
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

exports.signUpCheckCache = (req, res, next) => {
  if (verificationCache.get(req.query.phoneNumber) !== undefined) {
    throw new CustomError(null, VARIFICATION_CODE_IS_ALREADY_SENT, 403, false);
  }
  next();
};

exports.signInCheckCache = (req, res, next) => {
  const hashedVerificationCode = verificationCache.get(req.get('phoneNumber'));
  if (hashedVerificationCode === undefined) {
    throw new CustomError(null, NOT_REGISTERED_YET, 404);
  }
  verificationCache.del(req.get('phoneNumber'));
  next();
};

exports.signInValidateVerificationCode = (req, res, next) => {
  const hashedVerificationCode = verificationCache.get(req.get('phoneNumber'));
  if (!bcrypt.compareSync(req.body.VerificationCode, hashedVerificationCode)) {
    throw new CustomError(null, INVALIDـVARIFICATION_CODE, 400, true);
  }
  next();
};
