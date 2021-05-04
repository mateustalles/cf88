/* eslint-disable no-undef */
const connection = require('./connection');
import { ObjectId } from 'mongodb';

const findUserById = async (id) => {
  const user = await connection()
    .then((db) => db.collection('users').findOne(
      {
        _id: ObjectId(id),
      }
    ).then((data) => data )
    .catch((err) => {
      throw Error(err);
    }));

  return user;
}

const findUser = async (data) => {
  const user = await connection()
    .then((db) => db.collection('users').findOne(
      {
        data
      }
    ).then((data) => data )
    .catch((err) => {
      throw Error(err);
    }));

  return user;
}

module.exports = {
  findUserById,
  findUser,
}
