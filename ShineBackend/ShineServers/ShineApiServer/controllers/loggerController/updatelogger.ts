import db from '../../../Shared/helpers/mongoclient.ts';
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import  Logger  from "../../interfaces/logger.ts";
import { LOGGERCOLLECTION } from "../../../Shared/constants.ts";

const updatelogger = async (ctx: RouterContext) => {
    try {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: "Invalid data"
            }
        } else {
            const x = await ctx.request.body().value;
            const loggerName = ctx.params.loggerName;
            const mainLogger = await db.collection<Logger>(LOGGERCOLLECTION);
            const logger = await db.collection<Logger>(LOGGERCOLLECTION).findOne({ loggerName: loggerName });
            if (!logger) {
                ctx.response.status = 404;
                ctx.response.body = {
                    msg: "Logger not found"
                }
                return;
            }
            if (logger) {
                const updateData ={
                    description: x.description ?? logger.description,
                    isRollingFile: x.isRollingFile ?? logger.isRollingFile,
                    isEmail: x.isEmail ?? logger.isEmail,
                    isConsole: x.isConsole ?? logger.isConsole,
                    updatedAt: new Date(),
                    createdAt: logger.createdAt
                }
                await mainLogger.updateOne({
                    loggerName: loggerName
                }, {
                    $set: updateData
                });
                ctx.response.status = 201;
                ctx.response.body = {
                    msg: "Logger updated successfully",
                    data:updateData
                }
        }
    }} catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            msg: error.message
        }
    }
}

export default updatelogger;