/* eslint-disable no-undef */
import connection from './connection';

const updateOne = async (lead) => {
  const { name, email  } = lead
  const updateOne = await connection()
    .then((db) => db.collection('leads').updateOne(
    {
      email
    },
    {
      $set:
        {
          name,
          email
        }
    },
    {
      upsert : true,
    }
  ));

  return updateOne;
}

const getLeads = async () => {
  const getLeadsListing = await connection()
    .then((db) => db.collection('leads').find();

  return getLeadsListing;
}


module.exports = {
  updateOne,
  getLeads
}
