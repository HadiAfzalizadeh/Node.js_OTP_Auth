const jwt = require('jsonwebtoken');
const { bcrypt } = require('@root/global');
const { sendOtpSms } = require('@utils/auth');
const { CustomError } = require('@utils/general');
const { SENDING_OTP_SMS_ERROR_MESSAGE, SUCCESSFUL_LOGIN } =
  require('@resources/strings').userMessages;
const {
  SERVER_CACHE_PROBLEM_STORING_VARIFICATION_CODE,
  SUCCESS_SENDING_VARIFICATION_CODE,
} = require('@resources/strings').dataBaseMessages;
const { verificationCache } = require('@root/global');
const { config } = require('@root/config');
const cookie = require('cookie');

// TODO - Authentication - Convert all if error statements to try catch
exports.SignUp = async (req, res, next) => {
  // TODO - Authentication - Convert remain timestamp to second
  // TODO - Authentication - store phone number in cookie for sign in
  try {
    const verificationCode = Math.floor(
      Math.random() * 899999 + 100000,
    ).toString();
    if (
      !verificationCache.set(
        req.query.phoneNumber,
        bcrypt.hashSync(verificationCode, 10),
        60,
      )
    ) {
      throw new CustomError(
        (new Error().message = SERVER_CACHE_PROBLEM_STORING_VARIFICATION_CODE),
        SENDING_OTP_SMS_ERROR_MESSAGE,
        500,
        true,
      );
    }
    // await sendOtpSms(req.query.phoneNumber, verificationCode);
    console.log(verificationCode);
    return res.status(201).send({
      message: SUCCESS_SENDING_VARIFICATION_CODE,
      data: {
        delayTime: verificationCache.getTtl(req.query.phoneNumber) / 1000,
        phoneNumber: req.query.phoneNumber,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.SignIn = (req, res) => {
  verificationCache.del(req.get('phonenumber'));
  return res
    .header(
      'Set-Cookie',
      cookie.serialize(
        'JWT',
        jwt.sign({ phoneNumber: req.get('phonenumber') }, config.secrets.jwt),
        {
          httpOnly: true,
          secure: true,
        },
      ),
    )
    .status(201)
    .send({
      message: SUCCESSFUL_LOGIN,
    });
  // add refresh token to website
  // TODO - Authentication - XSS attacks
  // TODO - Authentication - man-in-the middle attack
  // eslint-disable-next-line max-len
  // TODO - Authentication - Brute force attack - 1 limit the number of tries and if dead line passed retry sending sms after ttl finished - 2 clound flare
  // TODO - Authentication - DOS and DDOS Attack also with one minute delay
};

exports.Protect = (req, res) => {
  // eslint-disable-next-line max-len
  // TODO - Authentication - check for bearer token in headers (authorization header must not be empty) - token also must have correct prefix
  // TODO - Authentication - Verify received JWT
  // TODO - Authentication - check is token a real user after verify
  // TODO - Authentication - if token is a real user go to next middleware
  // TODO - Authentication - if verify was false throw no auth exception
};
