import * as RxDB from 'rxdb';
<<<<<<< HEAD
import schemas from './schemas';
=======
import schema from './schemas';
import personSchema from './schemas/person';
>>>>>>> a2e17830a5c1203e024b086d3777ed08ecd6ede4

RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http'));

let dbPromise = null;

const collections = [
  {
    name: 'events',
<<<<<<< HEAD
    schema: schemas
=======
    schema: schema
  }, 
  {
    name: 'provider_users',
    schema: personSchema
>>>>>>> a2e17830a5c1203e024b086d3777ed08ecd6ede4
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
    Object.entries(schemas)
      .map(([name, schema]) => db.collection({ name, schema }))
  );
  return db;
};



export default () => {
  //RxDB.removeDatabase('eventsdb', 'idb');
  if(!dbPromise) {
    dbPromise = createDb();
  }
  return dbPromise;
};
