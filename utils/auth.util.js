const axios = require('axios');
const { smsProviderToken } = require('../config');
const { SENDING_OTP_SMS_ERROR_MESSAGE } =
  require('../resources/strings.resource').userMessages;
const { CustomError } = require('./general.util');

exports.sendOtpSms = (phoneNumber, verificationCode) => {
  const url = 'https://api.kavenegar.com/v1/'
    .concat(smsProviderToken)
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
      global.verificationCache.del(phoneNumber);
      throw new CustomError(error, SENDING_OTP_SMS_ERROR_MESSAGE, 500, true);
    });
};
