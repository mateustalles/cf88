/* eslint-disable no-undef */
const connection = require('./connection');

const insertPages = async (pages) => {
  const updateArray = pages.map((page) => {
    const sheetSlug = Object.keys(page)[0];
    const { [sheetSlug]: { pageSlug, sheetTitle, verbatimSlug, data } } = page;
    return ({
      updateOne: {
        filter: { [`${sheetSlug}.pageSlug`]: pageSlug },
        update: {
          $set: {
            [sheetSlug]: {
              pageSlug,
              sheetTitle,
              verbatimSlug,
              data,
            },
          },
        },
        upsert: true,
      },
    })
  });

  await connection()
    .then((db) => db.collection('pages').drop())
    .catch((err) => {
      if(err.message.match(/ns not found/)) return null;
      throw new Error(err);
    });

  const updatedPages = await connection()
    .then((db) => db.collection('pages').bulkWrite([...updateArray], { ordered: true })
    .catch((err) => {
      throw Error(err);
    }));

  return updatedPages;
}

const findPage = async (sheetSlug, pageSlug) => {
  const page = await connection()
    .then((db) => db.collection('pages').findOne(
      {
        [`${sheetSlug}.pageSlug`]: pageSlug,
      },
      {
        projection:
        {
          _id: 0,
          [`${sheetSlug}.verbatimSlug`]: 0,
        }
      }
    ).then((data) => data )
    .catch((err) => {
      throw Error(err);
    }));

  return page;
}

const getAllPages = async () => {
  const pages = await connection().then((db) => db.collection('pages').find(
    {},
    {
      projection:
        {
          _id: 0,
        }
      }
  ).toArray()
    .catch((err) => {
      throw Error(err);
    }));

  return pages
}

const updateOne = async (page) => {
  const { sheetSlug, sheetTitle, pageSlug, toBeUpdated, verbatimSlug, data  } = page
  const updateOne = await connection()
    .then((db) => db.collection('pages').updateOne(
    {
      [`${sheetSlug}.pageSlug`]: toBeUpdated,
    },
    {
      $set:
        {
          [sheetSlug]:
            {
              pageSlug,
              sheetTitle,
              verbatimSlug,
              data,
            }
        }
    },
    {
      upsert : true,
    }
  ));

  return updateOne;
}

const deleteOne = async (page) => {
  const { sheetSlug, pageSlug } = page
  const deleted = await connection()
    .then((db) => db.collection('pages').deleteOne(
      {
        [`${sheetSlug}.pageSlug`]: pageSlug,
      },
    )
    .catch((err) => {
      throw Error(err);
    }));

  return deleted;
}

module.exports = {
  insertPages,
  findPage,
  getAllPages,
  updateOne,
  deleteOne
}
