const jwt = require('jsonwebtoken');
const { bcrypt } = require('@root/global');
const { sendOtpSms } = require('@utils/auth');
const { CustomError } = require('@utils/general');
const { SENDING_OTP_SMS_ERROR_MESSAGE, SUCCESSFUL_LOGIN } =
  require('@resources/strings').userMessages;
const { SERVER_CACHE_PROBLEM_STORING_VARIFICATION_CODE } =
  require('@resources/strings').dataBaseMessages;
const { verificationCache } = require('@root/global');
const { config } = require('@root/config');
const cookie = require('cookie');

exports.SignUp = async (req, res, next) => {
  // TODO - Authentication - Convert remain timestamp to second
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
    // console.log(verificationCode);
    res.status(201).send({
      message: '',
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
  res
    .header(
      'Set-Cookie',
      cookie.serialize(
        'jsonWebToken',
        jwt.sign({ phoneNumber: req.get('phoneNumber') }, config.secrets.jwt),
        {
          httpOnly: true,
        },
      ),
    )
    .status(201)
    .send({
      message: SUCCESSFUL_LOGIN,
    });
  // TODO - Authentication - send token to user with unaccessible and not readable way (cookie) and make appropriate message and status code to the user
  // TODO - Authentication - XSS attacks
  // TODO - Authentication - man-in-the middle attack
  // TODO - Authentication - Brute force attack - 1 limit the number of tries and if dead line passed retry sending sms after ttl finished - 2 clound flare
  // TODO - Authentication - DOS and DDOS Attack also with one minute delay
};
