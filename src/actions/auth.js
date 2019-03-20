// --------------------- GOOGLE AUTH --------------------- //
export const BEGIN_GOOGLE_AUTH = 'BEGIN_GOOGLE_AUTH';
export const SUCCESS_GOOGLE_AUTH = 'SUCCESS_GOOGLE_AUTH';
export const FAIL_GOOGLE_AUTH = 'FAIL_GOOGLE_AUTH';
export const RETRY_GOOGLE_AUTH = 'RETRY_GOOGLE_AUTH';

export const beginGoogleAuth = () => ({ type: BEGIN_GOOGLE_AUTH });
export const failGoogleAuth = () => ({ type: FAIL_GOOGLE_AUTH });
export const successGoogleAuth = (user) => ({ 
  type: SUCCESS_GOOGLE_AUTH,
  payload: user
});
// --------------------- GOOGLE AUTH --------------------- //

// --------------------- OUTLOOK AUTH -------------------- //
export const BEGIN_OUTLOOK_AUTH = 'BEGIN_OUTLOOK_AUTH';
export const SUCCESS_OUTLOOK_AUTH = 'SUCCESS_OUTLOOK_AUTH';
export const FAIL_OUTLOOK_AUTH = 'FAIL_OUTLOOK_AUTH';
export const RETRY_OUTLOOK_AUTH = 'RETRY_OUTLOOK_AUTH';

export const beginOutlookAuth = () => ({ type: BEGIN_OUTLOOK_AUTH });
export const failOutlookAuth = () => ({ type: SUCCESS_OUTLOOK_AUTH });
export const successOutlookAuth = (user) => ({ 
  type: SUCCESS_OUTLOOK_AUTH,
  payload: user
});
// --------------------- OUTLOOK AUTH -------------------- //
