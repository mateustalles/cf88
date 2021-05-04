import session from 'express-session';
import MongoStore from 'connect-mongo';

export default function sessionMiddleware(req, res, next) {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
    client: req.dbClient,
    stringify: false,
  }),
  })(req, res, next);
}
