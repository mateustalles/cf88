/* eslint-disable no-undef */
const pagesModel = require('../../models/pagesModel');

const updateOne = async (req, res) => {
  const { body } = req;

  await pagesModel.updateOne(body).
    then(() => res.status(200).send('Atualizada'))
    .catch((err) => {
      throw Error(err);
    });
}

export default updateOne;
