const axios = require('axios');
const { SENDING_OTP_SMS_ERROR_MESSAGE } =
  require('../resources/strings.resource').userMessages;
const { CustomError } = require('./general.util');
const { verificationCache } = require('../global.variables');

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
      // verificationCache.del(phoneNumber);
      throw new CustomError(error, SENDING_OTP_SMS_ERROR_MESSAGE, 500, true);
    });
};
