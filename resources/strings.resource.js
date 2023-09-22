const userMessages = Object.freeze({
  SENDING_OTP_SMS_ERROR_MESSAGE:
    'ارسال پیامک اعتبارسنجی با مشکل مواجه شد.لطفا مجددا تلاش نموده با پشنیبانی تماس بگیرید',
  GENERAL_ERROR_MESSAGE: 'عملیات با مشکل مواجه شد',
  INVALID_PARAMETERS: 'مقادیر ورودی نامعتبر هستند',
});

const dataBaseMessages = Object.freeze({
  SERVER_CACHE_ZERO: 'The server cache ttl for this key was 0',
  SERVER_CACHE_PROBLEM_STORING_VARICATION_CODE:
    'Problem storing varication code in server cache',
});

module.exports = { userMessages, dataBaseMessages };
