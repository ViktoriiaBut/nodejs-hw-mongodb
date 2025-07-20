import { oAuth2Client } from "google-auth-library";

const oAuth2Client = new oAuth2Client({
 clientId: '',
 redirectUri: [],
 clientSecret: '',
})

const authorizeUrl = oAuth2Client.generateAuthUrl({
  // To get a refresh token, you MUST set access_type to `offline`.
  access_type: 'offline',
  // set the appropriate scopes
  scope: 'https://www.googleapis.com/auth/userinfo.profile',
  // A refresh token is only returned the first time the user
  // consents to providing access.  For illustration purposes,
  // setting the prompt to 'consent' will force this consent
  // every time, forcing a refresh_token to be returned.
  prompt: 'consent'
});
