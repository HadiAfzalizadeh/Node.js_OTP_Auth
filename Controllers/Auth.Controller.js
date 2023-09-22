const { sendOtpSms } = require('../utils/auth.util');
const { CustomError } = require('../utils/general.util');
const { SENDING_OTP_SMS_ERROR_MESSAGE } =
  require('../resources/strings.resource').userMessages;
const { SERVER_CACHE_PROBLEM_STORING_VARICATION_CODE } =
  require('../resources/strings.resource').dataBaseMessages;

exports.SignUp = async (req, res, next) => {
  try {
    const verificationCode = Math.floor(Math.random() * 899999 + 100000);
    const success = global.verificationCache.set(
      req.query.phoneNumber,
      verificationCode,
      60,
    );
    if (success) {
      await sendOtpSms(req.query.phoneNumber, verificationCode);
      res.status(200).send({
        data: {
          delayTime: global.verificationCache.getTtl(req.query.phoneNumber),
        },
      });
    }
    throw new CustomError(
      (new Error().message = SERVER_CACHE_PROBLEM_STORING_VARICATION_CODE),
      SENDING_OTP_SMS_ERROR_MESSAGE,
      500,
      true,
    );
  } catch (err) {
    next(err);
  }
};

exports.SignIn = async (req, res) => {
  const re = 'gogogzi';
  res.send(re);
  // TODO - Authentication - compare the 6 digit verification code recieved in req with the verification code that stored in server cash with the phone number in req as key
  // TODO - Authentication - if compare was true make a jwt token with phone number and jwt secret key with unlimited timeout
  // TODO - Authentication - send token to user with unaccessible and not readable way and make appropriate message and status code to the user
  // TODO - Authentication - if the compare was false throw the result with appropriate message and status code to the user
};
