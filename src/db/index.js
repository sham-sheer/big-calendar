import * as RxDB from 'rxdb';
import schema from './schemas';

RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http'));

let dbPromise = null;

const collections = [
  {
    name: 'events',
    schema: schema
  }
];

export const createDb = async () => {
  const db = await RxDB.create({
    name: 'eventsdb',
    adapter: 'idb',
    queryChangeDetection: true
  });
  window['db'] = db;
  await Promise.all(
    collections.map(colData => db.collection(colData))
  );
  return db;
};



export default () => {
  // RxDB.removeDatabase('eventsdb', 'idb');
  if(!dbPromise) {
    dbPromise = createDb();
  }
  return dbPromise;
};
