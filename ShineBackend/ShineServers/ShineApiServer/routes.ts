import { Router } from "../Shared/deps.ts";
import createLogger from "./controllers/loggerController/createlogger.ts";
import getAllloggers from "./controllers/loggerController/getAllloggers.ts";
import getLogger from "./controllers/loggerController/getlogger.ts";
import deleteLogger from "./controllers/loggerController/deletelogger.ts";
import updateLogger from "./controllers/loggerController/updatelogger.ts";
import createLog from "./controllers/logController/createlogs.ts";
import getlogsbylogger from "./controllers/logController/getlogsbylogger.ts";
import flushlogsbylogger from "./controllers/logController/flushlogsbylogger.ts";
import findOnelog from "./controllers/logController/findOnelog.ts";

const router = new Router();

const api_version = "v1";

const basepath = `/api/${api_version}/`;

router.post(basepath+"logger/create-logger", createLogger)
  .get(basepath+"logger/get-all-loggers", getAllloggers)
  .get(basepath+"logger/get-logger/:loggerName", getLogger)
  .delete(basepath+"logger/delete-logger/:loggerName", deleteLogger)
  .put(basepath+"logger/update-logger/:loggerName", updateLogger);

router.post(basepath+"log/create-log", createLog)
  .get(basepath+"log/get-logs/:loggerName", getlogsbylogger)
  .get(basepath+"log/find-one-log/:loggerName/:id", findOnelog)
  .delete(basepath+"log/flush-logs/:loggerName", flushlogsbylogger);

export default router;
