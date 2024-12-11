import SQLiteWorker from '@vlcn.io/crsqlite-wasm/sqlite-worker';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';

const worker = new SQLiteWorker();
const sqlFS = new SQLiteFS(new IndexedDBBackend());
worker.registerFileSystem(sqlFS);

export default worker;