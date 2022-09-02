import { bodyKeysLogger, levels } from "./validationConstants.ts";

const loggervalidatorupdate = (body:any) => {
  if (
    body.isRollingFile && body.isRollingFile == true &&
    !body.rollingLogDirectorypath
  ) {
    return {
      msg: "rollingLogDirectorypath is missing",
      status: 400,
    };
  }
  if (
    body.isEmail && body.isEmail == true &&
    (!body.emailLogLevel || !body.emailToPrimary || !body.emailToSecondary ||
      !body.emailFromPassword || !body.emailFrom)
  ) {
    return {
      msg:
        "Missing attributes from the Array [emailLogLevel, emailToPrimary,emailToSecondary, emailFrom, emailFromPassword]",
      status: 400,
    };
  }
  if (
    body.isEmail && body.isEmail == true && body.emailToPrimary &&
    (typeof body.emailToPrimary != "string")
  ) {
    return {
      msg: "emailToPrimary is not a string",
      status: 400,
    };
  }
  if (
    body.isEmail && body.isEmail == true && body.emailToSecondary &&
    (typeof body.emailToSecondary != "string")
  ) {
    return {
      msg: "emailToSecondary is not a string",
      status: 400,
    };
  }
  if (
    body.isEmail && body.isEmail == true && body.emailFrom &&
    (typeof body.emailFrom != "string")
  ) {
    return {
      msg: "emailFrom is not a string",
      status: 400,
    };
  }
  if (body.emailFromPassword && (typeof body.emailFromPassword != "string")) {
    return {
      msg: "emailFromPassword is not a string",
      status: 400,
    };
  }
  if (body.emailLogLevel && !levels.includes(body.emailLogLevel)) {
    return {
      msg:
        "emailLogLevel is not from any Array values [INFO,DEBUG,CRITICAL,WARNING,ERROR]",
      status: 400,
    };
  }
  if (
    body.flushIntervalCronExpression &&
    (typeof body.flushIntervalCronExpression != "string")
  ) {
    return {
      msg: "flushInterval is not a number",
      status: 400,
    };
  }
  if (body.emailToPrimary && (typeof body.emailToPrimary != "string")) {
    return {
      msg: "emailToPrimary is not a string",
      status: 400,
    };
  }
  if (body.emailToSecondary && (typeof body.emailToSecondary != "string")) {
    return {
      msg: "emailToSecondary is not a string",
      status: 400,
    };
  }
  if (body.emailFrom && (typeof body.emailFrom != "string")) {
    return {
      msg: "emailFrom is not a string",
      status: 400,
    };
  }
  if (
    body.rollingLogDirectorypath &&
    (typeof body.rollingLogDirectorypath != "string")
  ) {
    return {
      msg: "rollingLogDirectorypath is not a string",
      status: 400,
    };
  }
  if (
    body.isEmail && body.isEmail == true && body.emailFromPassword &&
    (typeof body.emailFromPassword != "string")
  ) {
    return {
      msg: "emailFromPassword is not a string",
      status: 400,
    };
  }
  if (
    body.isFlushLogs && body.isFlushLogs == true &&
    !body.flushIntervalCronExpression
  ) {
    return {
      msg: "flushIntervalCronExpression is missing",
      status: 400,
    };
  }
  if (
    body.isRollingFile && body.isRollingFile == true &&
    body.rollingLogDirectorypath &&
    (typeof body.rollingLogDirectorypath != "string")
  ) {
    return {
      msg: "rollingLogDirectorypath is not a string",
      status: 400,
    };
  }
  if (
    body.isEmail && body.isEmail == true && body.emailLogLevel &&
    (typeof body.emailLogLevel != "string")
  ) {
    return {
      msg: "emailLogLevel is not a string",
      status: 400,
    };
  }
  if (
    body.isEmail && body.isEmail == true && body.emailTo &&
    (typeof body.emailTo != "string")
  ) {
    return {
      msg: "emailTo is not a string",
      status: 400,
    };
  }
  if (
    body.isEmail && body.isEmail == true && body.emailFrom &&
    (typeof body.emailFrom != "string")
  ) {
    return {
      msg: "emailFrom is not a string",
      status: 400,
    };
  }
  if (
    body.isFlushLogs && body.isFlushLogs == true &&
    body.flushIntervalCronExpression &&
    (typeof body.flushIntervalCronExpression != "string")
  ) {
    return {
      msg: "flushIntervalCronExpression is not a number",
      status: 400,
    };
  }
  return {
    msg: "Validation Successful",
    status: 200,
  };
};

export default loggervalidatorupdate;
