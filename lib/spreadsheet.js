import { GoogleSpreadsheet } from 'google-spreadsheet';


export const spreadsheet = async (type) => {
  const doc = new GoogleSpreadsheet(type === 'original' ? process.env.SHEET_ID : process.env.BACKUP_SHEET_ID );
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();
  return doc;
};
