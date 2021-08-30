export const insertPages = async (db, pages) => {
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

  await db.collection('pages').drop()
    .catch((err) => {
      if(err.message.match(/ns not found/)) return null;
      throw new Error(err);
    });

  const updatedPages = await db.collection('pages')
    .bulkWrite([...updateArray], { ordered: true })
    .then((data) => data)
    .catch((err) => {
      throw Error(err);
    });

  return updatedPages;
}

export const findPage = async (db, sheetSlug, pageSlug) => {
  const page = await db.collection('pages').findOne(
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
    )
    .then((data) => data )
    .catch((err) => {
      throw Error(err);
    });

  return page;
}

export const getAllPages = async (db) => {
  const pages = await db.collection('pages').find(
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
    });

  return pages
}

export const updateOne = async (db, page) => {
  const { sheetSlug, sheetTitle, pageSlug, toBeUpdated, verbatimSlug, data  } = page
  const updateOne = await db.collection('pages').updateOne(
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
  )
  .then((data) => data)
  .catch((err) => {
    throw Error(err);
  });

  return updateOne;
}

export const deleteOne = async (db, page) => {
  const { sheetSlug, pageSlug } = page
  const deleted = await db.collection('pages').deleteOne(
      {
        [`${sheetSlug}.pageSlug`]: pageSlug,
      },
    )
    .then((data) => data)
    .catch((err) => {
      throw Error(err);
    });

  return deleted;
}

export const incrementViews = async (db, sheetSlug, pageSlug) => {
  await db.collection('pages').updateOne(
      {
        [`${sheetSlug}.pageSlug`]: pageSlug,
        [`${sheetSlug}.data.views`]: { $exists: false }
      },
      {
        $push: { [`${sheetSlug}.data`]: { views: 0 } },
      },
      {
        upsert: true
      }
    ).then((data) => data )
    .catch((err) => {
      throw Error(err);
    });

  await db.collection('pages').updateOne(
      {
        [`${sheetSlug}.pageSlug`]: pageSlug,
        [`${sheetSlug}.data`]: { $elemMatch: { views: { $exists: true } } }
      },
      {
        $inc: { [`${sheetSlug}.data.$.views`]: 1 }
      }
    ).then((data) => data )
    .catch((err) => {
      throw Error(err);
    });
}
