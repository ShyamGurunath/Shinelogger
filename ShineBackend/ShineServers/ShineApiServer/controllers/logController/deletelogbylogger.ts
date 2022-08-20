import db from "../../utils/mongoClient.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import Logger from "../../interfaces/logger.ts";
import { LOGGERCOLLECTION } from "../../../Shared/constants.ts";
import Log from "../../interfaces/log.ts";
import * as mongo from "https://deno.land/x/mongo@v0.31.0/mod.ts";

const deletelogbylogger = async (ctx: RouterContext) => {
  try {
    const loggerName = ctx.params.loggerName;
    const id = ctx.params.id;
    const loggerCollection = await db.collection<Logger>(LOGGERCOLLECTION)
      .find().toArray();
    // check if loggerName exists in db.listCollectionNames
    if (!loggerCollection.map((c) => c.loggerName).includes(loggerName)) {
      ctx.response.status = 404;
      ctx.response.body = {
        msg: "Logger not found",
      };
      return;
    } else {
      const deleteLog = await db.collection<Log>(loggerName).findOne({
        _id: new mongo.ObjectId(id),
      });
      if (!deleteLog) {
        ctx.response.status = 404;
        ctx.response.body = {
          msg: "Log not found",
        };
        return;
      }
      await db!.collection<Log>(loggerName).deleteOne({
        _id: new mongo.ObjectId(id),
      });
      ctx.response.status = 200;
      ctx.response.body = {
        msg: "Log deleted",
        data: id,
      };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      msg: error.message,
    };
  }
};

export default deletelogbylogger;
