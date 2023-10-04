const Joi = require('joi');
const axios = require('axios');
const { SENDING_OTP_SMS_ERROR_MESSAGE } =
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
      throw new CustomError(error, SENDING_OTP_SMS_ERROR_MESSAGE, 500, true);
    });
};

exports.phoneNumberValidation = (phoneNumber) => {
  const phoneNumberschema = Joi.string()
    .pattern(
      new RegExp(
        '09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}|^0[0-9]{2,}[0-9]{7,}$',
      ),
    )
    .required();
  return phoneNumberschema.validate(phoneNumber);
};
