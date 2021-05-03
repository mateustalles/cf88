/* eslint-disable no-undef */
const { spreadsheet } = require('./spreadsheet');

const sheetList = [
  ['TESE SEM REPERCUSSÃO GERAL', 'teses-sem-repercussao-geral'],
  ['TESE COM REPERCUSSÃO GERAL', 'teses-com-repercussao-geral'],
  ['SÚMULA VINCULANTE', 'sumula-vinculante'],
  ['SÚMULA STJ', 'sumula-stj'],
  ['SÚMULA STF', 'sumula-stf'],
]

const fetchData = async () => {
  const doc = await spreadsheet();

  const sheetsData = sheetList.map(async ([ sheetTitle, sheetSlug]) => {
    const sheet = doc.sheetsByTitle[sheetTitle];
    const rows = await sheet.getRows();
    const headers = Object.keys(rows[0]).filter((key) => !key.includes('_'));
    const rawData = rows.map(({ _rawData }) => _rawData);

    const refinedData = rawData.map((row) => {
      const pageTitle = row[0];
      const pageSlug = pageTitle.trim().replace(/\s/g, '-').toLowerCase();
      let verbatimSlug = row[1];
      verbatimSlug = verbatimSlug.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
      verbatimSlug = verbatimSlug.trim().split(' ')
      verbatimSlug = verbatimSlug.map((word) => word.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
      verbatimSlug = verbatimSlug.join();
      verbatimSlug = verbatimSlug.replace(/\.$/, '');
      const regex = /[^\w\s]+/g;
      verbatimSlug = verbatimSlug.replace(regex, '-');
      verbatimSlug = verbatimSlug.toLowerCase();
      row.shift();
      const entryList = row.map((cel, index) => {
        const filteredCel = cel.normalize('NFD').replace(/[\u0020\u00A0\u1680\u2000\u2001\t]/g, ' ')
        return { [headers[index + 1]]: filteredCel }
      });
      return {
        [sheetSlug]: {
        pageSlug,
        verbatimSlug,
        sheetTitle,
        data: [{ pageTitle }, ...entryList, { URL: `https://www.cf88.com.br/stf/${sheetSlug}/${pageSlug}` }],
        }
      }
    });

    return refinedData;
  });

  let data = await Promise.all(sheetsData).then((data) => data);
  const flattened = arr => [].concat(...arr);
  data = flattened(data);
  return data;
};

module.exports = {
  fetchData,
};
