const pagesModel = require('../../models/pagesModel');
const { fetchData } = require('../../libs/fetchData');

const updateSheets = async (req, res) => {
  const sheets = await fetchData();
  await pagesModel.insertPages(sheets)
    .then((data) => res.status(200).json(sheets))
    .catch((err) => {
      throw Error(err);
    });
};


export default updateSheets;
