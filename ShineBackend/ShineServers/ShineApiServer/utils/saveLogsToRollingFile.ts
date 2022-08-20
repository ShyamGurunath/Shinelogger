import {
  appendFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "../../Shared/deps.ts";

const saveLogsToRollingFile = (
  loggerName: string,
  log: string,
  dirpath: string,
) => {
  // check if directory exists
  if (!existsSync(dirpath)) {
    console.log(`${dirpath} does not exist. Creating directory to save logs`);
    mkdirSync(dirpath);
  }
  const date = new Date();
  // check if file exists with loggerName-YYYY-MM-DD.log with today's date
  const filepath =
    `${dirpath}/${loggerName}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`;
  if (!existsSync(filepath)) {
    console.log(`${filepath} does not exist. Creating file to save logs`);
    writeFileSync(filepath, "");
  }
  // append log to file
  appendFileSync(filepath, log);
};

export default saveLogsToRollingFile;
