const userMessages = Object.freeze({
  SENDING_OTP_SMS_ERROR_MESSAGE:
    'ارسال پیامک اعتبارسنجی با مشکل مواجه شد.لطفا مجددا تلاش نموده یا با پشنیبانی تماس بگیرید',
  GENERAL_ERROR_MESSAGE: 'عملیات با مشکل مواجه شد',
  INVALID_PARAMETERS: 'مقادیر ورودی نامعتبر هستند',
  NOT_REGISTERED_YET:
    'مدت زمان ورود کد اعتبارسنجی تمام شده است یا هنوز درخواست ارسال کد اعتبارسنجی نکرده اید. لطفا مجددا درخواست دهید',
  INVALID_VARIFICATION_CODE: 'کد اعتبارسنجی وارد شده معتبر نیست',
  VARIFICATION_CODE_HAS_BEEN_SENT: 'کد اعتبارسنجی برای شما ارسال شده است',
  SUCCESSFUL_LOGIN: 'شما با موفقیت وارد شدید',
  SUCCESS_SENDING_VARIFICATION_CODE:
    'کد اعتبار سنجی با موفقیت برای شما ارسال شد',
});

const dataBaseMessages = Object.freeze({
  SERVER_CACHE_PROBLEM_STORING_VARIFICATION_CODE:
    'Problem storing varification code in server cache',
});

module.exports = { userMessages, dataBaseMessages };
