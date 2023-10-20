const Joi = require('joi');
const axios = require('axios');
const { SENDING_OTP_SMS_ERROR_MESSAGE, INVALID_PARAMETERS } =
  require('@resources/strings').userMessages;
const { CustomError } = require('@utils/general');
const { verificationCache } = require('@root/global');
const {
  VARIFICATION_CODE_HAS_BEEN_SENT,
  NOT_REGISTERED_YET,
  INVALID_VARIFICATION_CODE,
} = require('@resources/strings').userMessages;
const { SERVER_CACHE_PROBLEM_STORING_VARIFICATION_CODE } =
  require('@resources/strings').dataBaseMessages;
const { bcrypt } = require('@root/global');

const sendOtpSms = (phoneNumber, verificationCode) => {
  console.log(verificationCode);
  // const url = 'https://api.kavenegar.com/v1/'
  //   .concat(process.env.SMS_PROVIDER_TOKEN)
  //   .concat('/verify/lookup.json?')
  //   .concat('receptor=')
  //   .concat(phoneNumber)
  //   .concat('&token=')
  //   .concat(verificationCode)
  //   .concat('&template=Test');
  // return axios
  //   .get(url)
  //   .then((res) => res)
  //   .catch((error) => {
  //     verificationCache.del(phoneNumber);
  //     throw new CustomError(SENDING_OTP_SMS_ERROR_MESSAGE, 500)
  //       .error(error)
  //       .saveToDatabase(true);
  //   });
};

const validatePhoneNumber = (phoneNumber) => {
  const phoneNumberschema = Joi.string()
    .pattern(
      new RegExp(
        '09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}|^0[0-9]{2,}[0-9]{7,}$',
      ),
    )
    .required();
  const { error } = phoneNumberschema.validate(phoneNumber);
  if (error) {
    throw new CustomError(INVALID_PARAMETERS, 400).error(error);
  }
};

const setVerificationCache = (phoneNumber, verificationCode) => {
  if (
    !verificationCache.set(
      phoneNumber,
      bcrypt.hashSync(verificationCode, 10),
      60,
    )
  ) {
    throw new CustomError(SENDING_OTP_SMS_ERROR_MESSAGE, 500).error(
      (new Error().message = SERVER_CACHE_PROBLEM_STORING_VARIFICATION_CODE),
    );
  }
};

const validateVerificationCode = (verificationCode) => {
  const phoneNumberschema = Joi.string()
    .pattern(new RegExp('^[0-9]{6,6}$'))
    .required();
  const { error } = phoneNumberschema.validate(verificationCode);
  if (error) {
    throw new CustomError(INVALID_PARAMETERS, 400).error(error);
  }
};

const signUpCheckCache = (phoneNumber) => {
  const delayTime = verificationCache.getTtl(phoneNumber);
  if (delayTime !== undefined) {
    throw new CustomError(VARIFICATION_CODE_HAS_BEEN_SENT, 403).data({
      delayTime: Math.ceil((delayTime - Date.now()) / 1000),
    });
  }
};

const signInCheckCache = (phoneNumber) => {
  const hashedVerificationCode = verificationCache.get(phoneNumber);
  if (hashedVerificationCode === undefined) {
    throw new CustomError(NOT_REGISTERED_YET, 404);
  }
};

const signInValidateVerificationCode = (phoneNumber, verificationCode) => {
  const hashedVerificationCode = verificationCache.get(phoneNumber);
  if (!bcrypt.compareSync(verificationCode, hashedVerificationCode)) {
    throw new CustomError(INVALID_VARIFICATION_CODE, 400).saveToDatabase(true);
  }
};

module.exports = {
  sendOtpSms,
  validatePhoneNumber,
  setVerificationCache,
  validateVerificationCode,
  signUpCheckCache,
  signInCheckCache,
  signInValidateVerificationCode,
};
