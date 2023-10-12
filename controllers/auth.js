const RandExp = require('randexp');
const jwt = require('jsonwebtoken');
const { bcrypt } = require('@root/global');
const { sendOtpSms } = require('@utils/auth');
const { CustomError } = require('@utils/general');
const {
  SENDING_OTP_SMS_ERROR_MESSAGE,
  SUCCESSFUL_LOGIN,
  SUCCESS_SENDING_VARIFICATION_CODE,
} = require('@resources/strings').userMessages;
const { SERVER_CACHE_PROBLEM_STORING_VARIFICATION_CODE } =
  require('@resources/strings').dataBaseMessages;
const { verificationCache } = require('@root/global');
const { config } = require('@root/config');
const cookie = require('cookie');

exports.SignUp = async (req, res, next) => {
  try {
    const verificationCode = new RandExp('^[0-9]{6,6}$').gen();
    if (
      !verificationCache.set(
        req.query.phoneNumber,
        bcrypt.hashSync(verificationCode, 10),
        60,
      )
    ) {
      throw new CustomError(SENDING_OTP_SMS_ERROR_MESSAGE, 500).error(
        (new Error().message = SERVER_CACHE_PROBLEM_STORING_VARIFICATION_CODE),
      );
    }
    // await sendOtpSms(req.query.phoneNumber, verificationCode);
    console.log(verificationCode);
    return res
      .header(
        'Set-Cookie',
        cookie.serialize('phoneNumber', req.query.phoneNumber, {
          httpOnly: true,
          maxAge: 60,
        }),
      )
      .status(201)
      .send({
        message: SUCCESS_SENDING_VARIFICATION_CODE,
        data: {
          delayTime: Math.ceil(
            (verificationCache.getTtl(req.query.phoneNumber) - Date.now()) /
              1000,
          ),
        },
      });
  } catch (err) {
    next(err);
  }
};

exports.SignIn = (req, res) => {
  verificationCache.del(req.phoneNumber);
  return res
    .header(
      'Set-Cookie',
      cookie.serialize(
        'JWT',
        jwt.sign({ phoneNumber: req.phoneNumber }, config.secrets.jwt),
        {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        },
      ),
    )
    .status(201)
    .send({
      message: SUCCESSFUL_LOGIN,
    });
  // TODO - add refresh token to website
  // TODO - limit the count tries of verification code
  // TODO - Authentication - XSS attacks
  // TODO - Authentication - man-in-the middle attack
  // eslint-disable-next-line max-len
  // TODO - Authentication - Brute force attack - 1 limit the number of tries and if dead line passed retry sending sms after ttl finished - 2 clound flare
  // TODO - Authentication - DOS and DDOS Attack also with one minute delay
};
