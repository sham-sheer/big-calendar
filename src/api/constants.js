/* Google OAuth Constants */

export const GOOGLE_CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
export const GOOGLE_API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
export const GOOGLE_SCOPE = `https://www.googleapis.com/auth/calendar.events`;


/* Outlook OAuth Constants */

export const OUTLOOK_SECRET = 'nqitvIH4666}agYYARW5{@^';
export const OUTLOOK_CLIENT_ID = '6b770a68-2156-4345-b0aa-d95419e31be1';
export const OUTLOOK_BASE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?';
export const OUTLOOK_REDIRECT_URL = 'http://localhost:3000/outlook-redirect'
export const OUTLOOK_SCOPE = 'openid profile Calendars.ReadWrite.Shared';
export const OUTLOOK_PARAMS_URL = `response_type=id_token+token&client_id=${OUTLOOK_CLIENT_ID}
                           &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foutlook-redirect
                           &scope=${OUTLOOK_SCOPE}&state=f175f48d-d277-9893-9c8d-dcc2a95ffe16
                           &nonce=593a2b06-d77b-31c2-ae43-e74c0ebeb304
                           &response_mode=fragment`
