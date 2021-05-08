import { GoogleSpreadsheet } from 'google-spreadsheet';


export const spreadsheet = async (id) => {
  const doc = new GoogleSpreadsheet(id === 'restore' ? process.env.SHEET_ID : id );

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();
  return doc;
};
