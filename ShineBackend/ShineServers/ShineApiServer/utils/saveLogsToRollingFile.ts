import {
  appendFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "../../Shared/deps.ts";
import logging  from "../../Shared/logsHandler.ts";

const saveLogsToRollingFile = async (
  loggerName: string,
  log: string,
  dirpath: string,
) => {
  // check if directory exists
  if (!existsSync(dirpath)) {
    logging.warning(`${dirpath} does not exist. Creating directory to save logs`);
    mkdirSync(dirpath);
  }
  const date = new Date();
  // check if file exists with loggerName-YYYY-MM-DD.log with today's date
  const filepath =
    `${dirpath}/${loggerName}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`;
  if (!existsSync(filepath)) {
    logging.warning(`${filepath} does not exist. Creating file to save logs`);
    writeFileSync(filepath, "");
  }
  // append log to file
  appendFileSync(filepath, log);
  logging.info(`Log saved to ${filepath}`);
};

export default saveLogsToRollingFile;
