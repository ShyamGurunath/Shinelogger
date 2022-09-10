import { bodyKeysLog, levels } from "./validationConstants.ts";

const logValidator = async (body:any) => {
  if (!body.loggerName) return { msg: "loggerName is missing", status: 400 };
  if (body.loggerName && typeof body.loggerName != "string") {
    return { msg: "loggerName is not a string", status: 400 };
  }
  if (!body.logmessage) return { msg: "logmessage is missing", status: 400 };
  if (body.logmessage && typeof body.logmessage != "string") {
    return { msg: "logmessage is not a string", status: 400 };
  }
  if (!body.logLevel) {
    return {
      msg:
        "loggerLevel is missing or Specify a logLevel from Array [INFO,DEBUG,CRITICAL,WARNING,ERROR]",
      status: 400,
    };
  }
  if (!levels.includes(body.logLevel)) {
    return {
      msg:
        "loggerLevel is not from any Array values [INFO,DEBUG,CRITICAL,WARNING,ERROR]",
      status: 400,
    };
  }
  if(!Object.keys(body).every((key) => bodyKeysLog.includes(key))){
    return {
      msg:
        `Body has extra keys, Specify only ${bodyKeysLog}`,
      status: 400,
    };
  }
  return {
    msg: "Validation Successful",
    status: 200,
  };
};

export default logValidator;
