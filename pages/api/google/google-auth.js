
import nc from 'next-connect';
import { google } from 'googleapis';

const keys = {
  "redirect_uris":["http://localhost:3000/oauth2callback", "https://www.cf88.com.br/oauth2callback"],
  "client_id": process.env.OAUTH_CLIENT_ID,
  "project_id": process.env.PROJECT_ID,
  "auth_uri":"https://accounts.google.com/o/oauth2/auth",
  "token_uri":"https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
  "client_secret": process.env.CLIENT_SECRET
}

const scopes = ['https://www.googleapis.com/auth/drive'];

const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris
);

google.options({ auth: oauth2Client });

const handler = nc();

handler.get(async (req, res) => {
  const authorizeUrl = await oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
  });

  res.status(200).json(authorizeUrl);
})

handler.post(async (req, res) => {
  const { body: { code } } = req;
  console.log(code);
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
  });

  res.status(200).send('Oauth2 Authenticated!');
})

export default handler;
