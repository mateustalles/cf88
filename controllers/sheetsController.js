const rescue = require('express-rescue');
const pagesModel = require('../models/pagesModel');
const { fetchData } = require('../services/fetchData');

const updateSheets = rescue(async (req, res) => {
  const sheets = await fetchData();
  await pagesModel.insertPages(sheets)
    .then(() => res.status(200).json(sheets))
    .catch((err) => {
      throw Error(err);
    });
});

const getPage = rescue(async (req, res) => {
  const { params: { sheet, id, verbatim } } = req;
  const page = await pagesModel.findPage(sheet, id, verbatim)
    .then(( data ) => data)
    .catch((err) => {
      throw Error(err);
    });
  res.json(page);
})

module.exports = {
  updateSheets,
  getPage,
};
