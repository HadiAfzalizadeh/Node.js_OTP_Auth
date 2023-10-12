const Joi = require('joi');
const axios = require('axios');
const { SENDING_OTP_SMS_ERROR_MESSAGE, INVALID_PARAMETERS } =
  require('@resources/strings').userMessages;
const { CustomError } = require('@utils/general');
const { verificationCache } = require('@root/global');

exports.sendOtpSms = (phoneNumber, verificationCode) => {
  const url = 'https://api.kavenegar.com/v1/'
    .concat(process.env.SMS_PROVIDER_TOKEN)
    .concat('/verify/lookup.json?')
    .concat('receptor=')
    .concat(phoneNumber)
    .concat('&token=')
    .concat(verificationCode)
    .concat('&template=Test');

  return axios
    .get(url)
    .then((res) => res)
    .catch((error) => {
      verificationCache.del(phoneNumber);
      throw new CustomError(SENDING_OTP_SMS_ERROR_MESSAGE, 500)
        .error(error)
        .saveToDatabase(true);
    });
};

exports.ValidatePhoneNumber = (phoneNumber) => {
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

exports.ValidateVerificationCode = (verificationCode) => {
  const phoneNumberschema = Joi.string()
    .pattern(new RegExp('^[0-9]{6,6}$'))
    .required();
  const { error } = phoneNumberschema.validate(verificationCode);
  if (error) {
    throw new CustomError(INVALID_PARAMETERS, 400).error(error);
  }
};
