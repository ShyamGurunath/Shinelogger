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

router.post("/api/create-logger", createLogger)
  .get("/api/get-all-loggers", getAllloggers)
  .get("/api/get-logger/:loggerName", getLogger)
  .delete("/api/delete-logger/:loggerName", deleteLogger)
  .put("/api/update-logger/:loggerName", updateLogger);

router.post("/api/log/create-log", createLog)
  .get("/api/log/get-logs/:loggerName", getlogsbylogger)
  .get("/api/log/find-one-log/:loggerName/:id", findOnelog)
  .delete("/api/log/flush-logs/:loggerName", flushlogsbylogger);

export default router;
