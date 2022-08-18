import db from '../../../Shared/helpers/mongoclient.ts';
import Logger from "../../interfaces/logger.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import {LOGGERCOLLECTION} from "../../../Shared/constants.ts";
import Log from "../../interfaces/log.ts";


const createlogger = async (ctx: RouterContext) => {
    try {
        if(!ctx.request.hasBody){
            ctx.response.status = 400;
            ctx.response.body = {
                msg: "Invalid data"
            }
        }else{
        const x = await ctx.request.body().value;
        // loggerCollection is the name of the collection in mongo db where we will store the loggers
        const loggerCollection = await db.collection<Logger>(LOGGERCOLLECTION);
        // NewCollection is created under the name of the x.loggerName to store logController
        const newLogger = await db.collection<Log>(x.loggerName);
        // check if loggerName already exists
        const logger = await db.collection(LOGGERCOLLECTION).findOne({loggerName: x.loggerName});
        if(logger){
            ctx.response.status = 400;
            ctx.response.body = {
                msg: "LoggerName already exists"
            }
            return;
        }
        const datetime = new Date();
        const loggerData = {
            loggerName: x.loggerName,
            description: x.description,
            isRollingFile: x.isRollingFile,
            isEmail: x.isEmail,
            isConsole: x.isConsole,
            createdAt: datetime,
            updatedAt: datetime
        }
        await loggerCollection.insertOne(loggerData);
        ctx.response.status = 201;
        ctx.response.body = {
            msg: "Logger created successfully",
            data: loggerData
        }
    }} catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            msg: error.message
        }
        }

    }
export default createlogger;
