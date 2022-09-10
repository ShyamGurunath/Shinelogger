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
import  logging  from "../../Shared/logsHandler.ts";
import { Database } from "https://deno.land/x/mongo@v0.31.0/mod.ts";

const URI =
  `mongodb://${MONGOUSER}:${MONGOPASSWORD}@${MONGOHOST}:${MONGOPORT}/`;

// Mongo Connection Init
const client = new mongo.MongoClient();

let db: Database | undefined;

const connectToMongo = async () => {

    try {
    await client.connect(URI);
    logging.info("Database successfully connected");
    db = await client.database(DATABASENAME);
    const collectionExists = await db.listCollectionNames();
    if (!collectionExists.includes(LOGGERCOLLECTION)) {
      await db.createCollection<Logger>(LOGGERCOLLECTION);
      logging.info(`${LOGGERCOLLECTION} Collection successfully created`);
    }
    } catch (error) {
    logging.error(error);
    }
}

await connectToMongo().catch((err) => {
    logging.error("Error connecting to mongo", err);
  connectToMongo();
});
export default db;
