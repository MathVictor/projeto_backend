require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

const client = new MongoClient(uri);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

async function createEvent(data) {
  const db = await connect();
  const result = await db.collection('eventos').insertOne(data);
  console.log('Evento inserido com ID:', result.insertedId); // log
  return result;
}


async function getEventsByUser(userId) {
  const db = await connect();
  return db.collection('eventos').find({ userId }).toArray();
}

module.exports = {
  createEvent,
  getEventsByUser
};
