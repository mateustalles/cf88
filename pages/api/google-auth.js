
import nc from 'next-connect';
import { all } from '@/middlewares/index';
import {google} from 'googleapis';
import open from 'open';

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
  keys.redirect_uris[0]
);

google.options({ auth: oauth2Client });

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {
  const authorizeUrl = await oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
  });

  res.status(200).json(authorizeUrl);
})

export default handler;
