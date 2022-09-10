const levels: Array<string> = ["INFO", "DEBUG", "CRITICAL", "WARNING", "ERROR"];
const bodyKeysLogger = [
  "isRollingFile",
  "isEmail",
  "isFlushLogs",
  "emailLogLevel",
  "emailToPrimary",
  "emailToSecondary",
  "emailFrom",
  "emailFromPassword",
  "flushIntervalCronExpression",
  "rollingLogDirectorypath",
  "emailFrom",
  "loggerName",
];
const bodyKeysLog = ["loggerName", "logmessage", "logLevel","additionalInfo"];
export { bodyKeysLog, bodyKeysLogger, levels };
