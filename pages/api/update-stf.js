/* eslint-disable no-undef */
const pagesModel = require('../../models/pagesModel');
const { fetchData } = require('../../lib/fetchData');

const updateSheets = async (req, res) => {
  const sheets = await fetchData();
  await pagesModel.insertPages(sheets)
    .then(() => res.status(200).json(sheets))
    .catch((err) => {
      throw Error(err);
    });
};


export default updateSheets;
