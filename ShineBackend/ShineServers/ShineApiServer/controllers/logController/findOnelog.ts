import db from '../../../Shared/helpers/mongoclient.ts';
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import  Logger  from "../../interfaces/logger.ts";
import { LOGGERCOLLECTION } from "../../../Shared/constants.ts";
import Log from "../../interfaces/log.ts";
import * as mongo from "https://deno.land/x/mongo@v0.31.0/mod.ts";


const findOnelog = async (ctx:RouterContext) => {
    try {
        const loggerName = await ctx.params.loggerName;
        const id = await ctx.params.id;
        const loggerCollection = await db.collection<Logger>(LOGGERCOLLECTION).find().toArray();
        // check if loggerName exists in db.listCollectionNames
        if (!loggerCollection.map(c => c.loggerName).includes(loggerName)) {
            ctx.response.status = 404;
            ctx.response.body = {
                msg: "Logger not found"
            }
            return;
        }else {
            const log = await db.collection<Log>(loggerName).findOne({ _id: new mongo.ObjectId(id) });
            if(!log) {
                ctx.response.status = 404;
                ctx.response.body = {
                    msg: "Log not found"
                }
                return;
            }
            ctx.response.status = 200;
            ctx.response.body = {
                msg: "Log found",
                data: log
            }
        }
    }
    catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            msg: error.message
        }
    }
};

export default findOnelog;