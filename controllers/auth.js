const RandExp = require('randexp');
const jwt = require('jsonwebtoken');
const {
  sendOtpSms,
  validatePhoneNumber,
  setVerificationCache,
  signUpCheckCache,
  validateVerificationCode,
  signInCheckCache,
  signInValidateVerificationCode,
} = require('@utils/auth');
const { SUCCESSFUL_LOGIN, SUCCESS_SENDING_VARIFICATION_CODE } =
  require('@resources/strings').userMessages;
const { verificationCache } = require('@root/global');
const { config } = require('@root/config');
const cookie = require('cookie');

exports.SignUp = async (req, res, next) => {
  try {
    validatePhoneNumber(req.query.phoneNumber);

    signUpCheckCache(req.query.phoneNumber);

    const verificationCode = new RandExp('^[0-9]{6,6}$').gen();

    setVerificationCache(req.query.phoneNumber, verificationCode);

    await sendOtpSms(req.query.phoneNumber, verificationCode);

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
  const headerPhoneNumber = cookie.parse(req.headers.cookie || '').phoneNumber;

  validatePhoneNumber(headerPhoneNumber);

  validateVerificationCode(req.body.VerificationCode);

  signInCheckCache(headerPhoneNumber);

  signInValidateVerificationCode(headerPhoneNumber, req.body.VerificationCode);

  verificationCache.del(headerPhoneNumber);
  return res
    .header(
      'Set-Cookie',
      cookie.serialize(
        'Refresh-Token',
        jwt.sign(
          { phoneNumber: headerPhoneNumber },
          config.secrets.REFRESH_TOKEN_PRIVATE_KEY,
        ),
        {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        },
      ),
    )
    .status(201)
    .send({
      'X-Access-Token': jwt.sign(
        { phoneNumber: headerPhoneNumber },
        config.secrets.ACCESS_TOKEN_PRIVATE_KEY,
      ),
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
