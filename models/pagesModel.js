const connection = require('./connection');

const insertPages = async (pages) => {
  const updateArray = pages.map((page) => {
    const { _id, sheetSlug, verbatimSlug, ...newPageObj } = page;
    return ({
      updateOne: {
        filter: { "_id": page._id},
        update: {
          $set: {
            sheetSlug,
            verbatimSlug,
            data: { ...newPageObj },
          },
        },
        upsert: true,
      },
    })
  });

  const updatedPages = await connection()
    .then((db) => db.collection('pages').bulkWrite([...updateArray], { ordered: false })
    .catch((err) => {
      throw Error(err);
    }));

  return updatedPages;
}

const findPage = async (sheetSlug, id) => {
  const page = await connection()
    .then((db) => db.collection('pages').findOne({
      $and:
        [
          {
            _id: id,
          },
          {
            [`${sheetSlug}.sheetSlug`]: sheetSlug,
          }
        ]
      }, {
        projection: {
          [`${sheetSlug}.verbatimSlug`]: 0,
        }
    }).then((data) => data)
    .catch((err) => {
      throw Error(err);
    }));

  return page;
}

const getAllPages = async () => {
  const pages = await connection()
    .then((db) => db.collection('pages').find().toArray());
  return pages
}

module.exports = {
  insertPages,
  findPage,
  getAllPages,
}
