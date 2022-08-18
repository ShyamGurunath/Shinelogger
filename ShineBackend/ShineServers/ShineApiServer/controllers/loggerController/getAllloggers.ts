import db from '../../../Shared/helpers/mongoclient.ts';
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import  Logger  from "../../interfaces/logger.ts";
import { LOGGERCOLLECTION } from "../../../Shared/constants.ts";


const getAllloggers = async (ctx: RouterContext) => {
    try {
        const allLoggers = await db.collection<Logger>(LOGGERCOLLECTION).find().toArray();
        ctx.response.status = 200;
        ctx.response.body = {
            msg: "All loggers",
            data: allLoggers
        }
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            msg: error.message
        }
    }
}
export default getAllloggers;