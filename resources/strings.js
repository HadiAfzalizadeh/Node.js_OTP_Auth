const userMessages = Object.freeze({
  SEND_OTP_SMS_ERROR_MESSAGE:
    'ارسال پیامک اعتبارسنجی با مشکل مواجه شد.لطفا مجددا تلاش نموده با پشنیبانی تماس بگیرید',
  GENERAL_ERROR_MESSAGE: 'عملیات با مشکل مواجه شد',
  INVALID_PARAMETERS: 'مقادیر ورودی نامعتبر هستند',
  NOT_REGISTERED_YET:
    'مدت زمان ورود کد اعتبارسنجی تمام شده است یا هنوز درخواست ارسال کد اعتبارسنجی نکرده اید. لطفا مجددا درخواست دهید',
  INVALID_VARIFICATION_CODE: 'کد اعتبارسنجی وارد شده معتبر نیست',
  VARIFICATION_CODE_IS_ALREADY_SENT:
    'کد اعتبارسنجی قبلا برای شما ارسال شده است',
});

const dataBaseMessages = Object.freeze({
  SERVER_CACHE_PROBLEM_STORING_VARIFICATION_CODE:
    'Problem storing varification code in server cache',
});

module.exports = { userMessages, dataBaseMessages };
