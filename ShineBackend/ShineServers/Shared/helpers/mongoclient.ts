import {DATABASENAME,
        LOGGERCOLLECTION,
        MONGOHOST,
        MONGOPORT,
        MONGOUSER,
        MONGOPASSWORD} from "../constants.ts";
import Logger from "../../ShineApiServer/interfaces/logger.ts";
import {mongo} from "../deps.ts";
import {log} from "../deps.ts";


const URI = `mongodb://${MONGOUSER}:${MONGOPASSWORD}@${MONGOHOST}:${MONGOPORT}/`;

// Mongo Connection Init
const client = new mongo.MongoClient();

try {
    await client.connect(URI);
    log.info("Database successfully connected");
} catch (err) {
    log.error(err.message);
}
var db;
try {
    // Mongo DB & Collection Init
    db = await client.database(DATABASENAME);
    const collectionExists = await db.listCollectionNames();
    if (!collectionExists.includes(LOGGERCOLLECTION)) {
        await db.createCollection<Logger>(LOGGERCOLLECTION);
        log.info("Collection successfully created");
    }
}
catch (err) {
    log.error(err.message);
}

export default db;
