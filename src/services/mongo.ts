import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI ?? ''; // mongodb://localhost:27017

export const mongoClient = new MongoClient(MONGODB_URI);

export enum MongoDatabases {
  RESTAPI = 'restapi',
}

enum MongoRestApiCollections {
  CALCULATORS = 'calculators',
}

export const MongoCollections = {
  [MongoDatabases.RESTAPI]: MongoRestApiCollections,
};
