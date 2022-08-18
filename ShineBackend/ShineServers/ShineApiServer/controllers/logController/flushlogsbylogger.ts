import db from '../../../Shared/helpers/mongoclient.ts';
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import  Logger  from "../../interfaces/logger.ts";
import { LOGGERCOLLECTION } from "../../../Shared/constants.ts";
import Log from "../../interfaces/log.ts";

const flushlogsbylogger = async (ctx:RouterContext) => {
    try {
        const loggerName = ctx.params.loggerName;
        const loggerCollection = await db.collection<Logger>(LOGGERCOLLECTION).find().toArray();
        // check if loggerName exists in db.listCollectionNames
        if (!loggerCollection.map(c => c.loggerName).includes(loggerName)) {
            ctx.response.status = 404;
            ctx.response.body = {
                msg: "Logger not found"
            }
            return;
        }
        const logs = await db.collection<Log>(loggerName).deleteMany({});
        ctx.response.status = 200;
        ctx.response.body = {
            msg: "Log deleted",
            data: logs
        }
    }
    catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            msg: error.message
        }
    }
};

export default flushlogsbylogger;