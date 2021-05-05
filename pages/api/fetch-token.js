
// import nc from 'next-connect';
// import url from 'url';
// import { all } from '@/middlewares/index';
// import {google} from 'googleapis';

// const keys = {
//   "redirect_uris":["http://localhost:3000/oauth2callback", "https://www.cf88.com.br/oauth2callback"],
//   "client_id": process.env.OAUTH_CLIENT_ID,
//   "project_id": process.env.PROJECT_ID,
//   "auth_uri":"https://accounts.google.com/o/oauth2/auth",
//   "token_uri":"https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
//   "client_secret": process.env.CLIENT_SECRET
// }

// const oauth2Client = new google.auth.OAuth2(
//   keys.client_id,
//   keys.client_secret,
//   keys.redirect_uris[0]
// );

// const handler = nc();
// handler.use(all);

// handler.get(async (req, res) => {
//   const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
//   res.end('Authentication successful! Please return to the console.');
//   const { tokens } = await oauth2Client.getToken(qs.get('code'));
//   oauth2Client.setCredentials(tokens);
//   res.status(200).json(oauth2Client);
// })

// export default handler;
