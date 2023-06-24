export const SendVerificationCode = async (req, res) => {
  const data = {
    PhoneNumber: req.PhoneNumber,
    Code: 454545,
  };

  res.send(data);
};

export const SignIn = async (req, res) => {};

export const SignOut = async (req, res) => {};
