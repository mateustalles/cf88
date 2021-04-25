/* eslint no-underscore-dangle: ["error", { "allow": ["_rawData"] }] */
require('dotenv').config();

const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet('1ASDHZ3uSSe03cydXwk6YipHOA2rtBg4Omd38MCJDtlE');

const spreadsheet = async () => {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();
  return doc;
};

module.exports = {
  spreadsheet,
};
