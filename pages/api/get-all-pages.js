const pagesModel = require('../../models/pagesModel');

const getAllPages = async (req, res) => {
  await pagesModel.getAllPages().
    then((data) => res.status(200).json(data))
    .catch((err) => {
      throw Error(err);
    });
}

export default getAllPages;
