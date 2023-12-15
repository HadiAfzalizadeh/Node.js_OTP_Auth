const { CustomError } = require('@utils/general');
const jwt = require('jsonwebtoken');
const { FORBIDDEN_ACCESS } = require('@resources/strings').userMessages;
const { config } = require('@root/config');

exports.protect = (req, res, next) => {
  // eslint-disable-next-line max-len
  // TODO - Authentication - check for bearer token in headers (authorization header must not be empty) - token also must have correct prefix

  // TODO - Authentication - below line is not tested yet
  const bearerToken = req.headers.authorization?.split('Bearer ')[1];
  if (!bearerToken) {
    throw new CustomError(FORBIDDEN_ACCESS, 401);
  }
  try {
    jwt.verify(bearerToken, config.secrets.ACCESS_TOKEN_PRIVATE_KEY);
  } catch (err) {
    try {
    } catch (error) {}
  }
  // TODO - Authentication - Verify received JWT
  next();
  // TODO - Authentication - if verify was false throw no auth exception
};
// TODO - Authentication - token is in normal headers it should be on auth header
