import db from '../../../Shared/helpers/mongoclient.ts';
import Logger from "../../interfaces/logger.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import {LOGGERCOLLECTION} from "../../../Shared/constants.ts";
import Log from "../../interfaces/log.ts";
import sendLogToWebSocketServer from "../../../Shared/helpers/websocketclient.ts";


const createlog = async (ctx:RouterContext) => {
    try {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: "Invalid data"
            }
        } else {
            const x = await ctx.request.body().value;
            const logger = await db.collection<Logger>(LOGGERCOLLECTION).findOne({ loggerName: x.loggerName });
            if (!logger) {
                ctx.response.status = 404;
                ctx.response.body = {
                    msg: "Log cannot be sent, Logger not found"
                }
                return;
            }
            if (logger) {
                const logcollection = await db.collection<Log>(x.loggerName);
                const log = {
                    loggerName: x.loggerName,
                    logmessage: x.logmessage,
                    logLevel: x.logLevel,
                    logTimeStamp: new Date(),
                    additionalInfo: x.additionalInfo
                 }
                await logcollection.insertOne(log);
                await sendLogToWebSocketServer(log);
                ctx.response.status = 201;
                ctx.response.body = {
                    msg: "Log Saved successfully",
                    data: log
                }
        }
    }} catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            msg: error.message
        }
    }
}
export default createlog;