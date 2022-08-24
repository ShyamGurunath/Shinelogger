import db from "../../utils/mongoClient.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import Logger from "../../interfaces/logger.ts";
import { LOGGERCOLLECTION } from "../../../Shared/constants.ts";

const getlogger = async (ctx: RouterContext) => {
  try {
    const logger = await db!.collection<Logger>(LOGGERCOLLECTION).findOne({
      loggerName: ctx.params.loggerName,
    });
    if (!logger) {
      ctx.response.status = 404;
      ctx.response.body = {
        msg: "Logger not found",
      };
      return;
    }
    ctx.response.status = 200;
    ctx.response.body = {
      msg: "Logger found",
      data: logger,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      msg: error.message,
    };
  }
};
export default getlogger;
