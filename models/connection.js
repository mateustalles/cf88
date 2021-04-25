const mongoClient = require('mongodb').MongoClient;

const connection = () => mongoClient
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => conn.db(process.env.MONGODB_DB))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

module.exports = connection;
