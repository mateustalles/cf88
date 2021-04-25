const connection = require('./connection');

const insertPages = async (pages) => {
  const updateArray = pages.map((page) => {
    const { _id, ...newPageObj } = page;
    const { sheetSlug } = newPageObj;
    return ({
      updateOne: {
        filter: { "_id": page._id},
        update: {
          $set: {
            [sheetSlug]: { ...newPageObj },
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

const findPage = async (sheetSlug, id, verbatimSlug) => {
//   const verbatimRe = new RegExp(`^${verbatimSlug.slice(10)}.*$`);
  const page = await connection()
    .then((db) => db.collection('pages')
  .findOne({
    $and:
      [
        {
          _id: id,
        },
        {
          [`${sheetSlug}.verbatimSlug`]: verbatimSlug,
        }
      ]
    }, {
      projection: {
        [`${sheetSlug}.verbatimSlug`]: 0,
        [`${sheetSlug}.sheetSlug`]: 0
      }
    }).then((data) => data)
    .catch((err) => {
      throw Error(err);
    }));

  return page;
}


module.exports = {
  insertPages,
  findPage,
}
