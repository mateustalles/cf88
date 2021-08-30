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
  const data = await connection()
    .then((db) => db.collection('leads')
      .aggregate([
        { $sort: { name: 1 } },
        { $project: { _id: 0 }}
      ])
      .toArray()
      .catch((err) => {
        throw Error(err);
      }))
  return data
}


module.exports = {
  createLead,
  getLeads
}
