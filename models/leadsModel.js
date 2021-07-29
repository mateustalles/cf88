/* eslint-disable no-undef */
import connection from './connection';

const createLead = async (lead) => {
  const { name, email  } = lead
  const newLead = await connection()
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

  return newLead;
}

const getLeads = async () => {
  const getLeadsListing = await connection()
    .then((db) => db.collection('leads').find());

  return getLeadsListing;
}


module.exports = {
  createLead,
  getLeads
}
