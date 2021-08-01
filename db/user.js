import { nanoid } from 'nanoid';
import normalizeEmail from 'validator/lib/normalizeEmail';

export async function findUserById(db, userId) {
  return db.collection('users').findOne({
    _id: userId,
  }).then((user) => user || null);
}

export async function findUserByEmail(db, email) {
  email = normalizeEmail(email);
  return db.collection('users').findOne({
    email,
  }).then((user) => user || null);
}

export async function updateUserById(db, id, update) {
  return db.collection('users').findOneAndUpdate(
    { _id: id },
    { $set: update },
    { returnOriginal: false },
  ).then(({ value }) => value);
}

export async function insertUser(db, {
  email, password, bio = '', name, profilePicture,
}) {
  return db
    .collection('users')
    .insertOne({
      _id: nanoid(12),
      emailVerified: false,
      profilePicture,
      email,
      password,
      name,
      bio,
      role: 'user'
    })
    .then(({ ops }) => ops[0]);
}
export const createLead = async (db, lead) => {
  const { name, email  } = lead;
  const newLead = await db.collection('leads').updateOne(
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
  ).then((data) => data)
  .catch((err) => console.error(err));

  return newLead;
}

export const getLeads = async (db) => {
  const getLeadsListing = await db.collection('leads').find();

  return getLeadsListing;
}
