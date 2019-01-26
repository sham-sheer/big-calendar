import * as RxDB from 'rxdb';
import adapter from 'pouchdb-adapter-node-websql';
import schema from './schemas';

RxDB.plugin(adapter);

let dbPromise;

const createDb() = async() => {
  const db = await RxDB.create({
    name: 'eventsdb',
    adapter: 'websql',
    queryChangeDetection: true
  });
  console.dir(db);
  await db.collection({
    name: 'events',
    schema: 'schema',
  })
}



export default () => {
  if(!dbPromise) {
    dbPromise = createDb();
  }
  return dbPromise;
}
