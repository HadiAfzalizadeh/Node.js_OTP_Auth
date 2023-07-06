/* eslint-disable max-len */
exports.SignUp = (req, res) => {
  // produces a 6 digit verification code
  // send verification code to the phone number in req
  // store the verification code to the server cash with the phone number key for one minute if the code was sent to the user successfully
  // make res to user with appropriate message and status code
};

exports.SignIn = async (req, res) => {
  // compare the 6 digit verification code recieved in req with the verification code that stored in server cash with the phone number in req as key
  // if compare was true make a jwt token with phone number and jwt secret key with unlimited timeout
  // send token to user with unaccessible and not readable way and meake appropriate message and status code to the user
  // if the compare was false throw the result with appropriate message and status code to the user
};
