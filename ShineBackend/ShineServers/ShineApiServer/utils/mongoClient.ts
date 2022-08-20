import {
  DATABASENAME,
  LOGGERCOLLECTION,
  MONGOHOST,
  MONGOPASSWORD,
  MONGOPORT,
  MONGOUSER,
} from "../../Shared/constants.ts";
import Logger from "../interfaces/logger.ts";
import { mongo } from "../../Shared/deps.ts";
import { log } from "../../Shared/deps.ts";
import { Database } from "https://deno.land/x/mongo@v0.31.0/mod.ts";

const URI =
  `mongodb://${MONGOUSER}:${MONGOPASSWORD}@${MONGOHOST}:${MONGOPORT}/`;

// Mongo Connection Init
const client = new mongo.MongoClient();

try {
  await client.connect(URI);
  log.info("Database successfully connected");
} catch (err) {
  log.error(err.message);
}
let db: Database | undefined;
try {
  // Mongo DB & Collection Init
  db = await client.database(DATABASENAME);
  const collectionExists = await db.listCollectionNames();
  if (!collectionExists.includes(LOGGERCOLLECTION)) {
    await db.createCollection<Logger>(LOGGERCOLLECTION);
    log.info("Collection successfully created");
  }
} catch (err) {
  log.error(err.message);
}
export default db;
