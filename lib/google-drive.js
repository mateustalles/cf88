const { google } = require('googleapis');
const fs = require('fs');

const listFiles = async () => {
  const drive = google.drive('v3');
  const response = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  const files = response.data.files;
  if (files.length === 0) {
    console.log('No files found.');
  } else {
    console.log('Files:');
    for (const file of files) {
      console.log(`${file.name} (${file.id})`);
    }
  }
}

export const uploadFile = async (name) => {
  const drive = google.drive('v3');
  const fileMetadata = {
    'name': name,
    parents: ['1pFTO2Yjoq5TTcxrAcGc97IwmWWcapCZc']
  };
  const media = {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    body: fs.createReadStream(`files/${name}`)
  };
  return drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, (err, file) => {
    if (err) {
      console.error(err);
    } else {
      return file;
    }
  })
}

module.exports = {
  listFiles,
  uploadFile,
}
