import logValidator from "../validation/logValidator.ts";
import logvalidatorcreate from "../validation/loggerValidatorCreate.ts";
import loggervalidatorupdate from "../validation/loggerValidatorUpdate.ts";

const controllersApiValidationMiddleware = async (context, next) => {
  // check if request is POST or PUT
  try {
    if (context.request.method === "POST" || context.request.method === "PUT") {
      // check if a header is present
      if (!context.request.headers.get("API_TYPE")) {
        context.response.status = 400;
        context.response.body = {
          msg:
            "API_TYPE header is missing [Specify API_TYPE header as 'logger' or 'log']",
        };
        return;
      }
      if (
        context.request.headers.get("API_TYPE") &&
        (context.request.headers.get("API_TYPE") === "logger" ||
          context.request.headers.get("API_TYPE") === "log")
      ) {
        if (
          context.request.headers.get("API_TYPE") === "log" &&
          context.request.hasBody
        ) {
          // check if the body type is Logger
          const x = await context.request.body().value;
          const validator = await logValidator(x);
          if (validator.status === 400) {
            context.response.status = 400;
            context.response.body = {
              msg: validator.msg,
            };
            return;
          }
        }
        if (
          context.request.headers.get("API_TYPE") === "logger" &&
          context.request.hasBody
        ) {
          // check if the body type is Logger
          const x = await context.request.body().value;
          if (context.request.method === "POST") {
            const validator = await logvalidatorcreate(x);
            if (validator.status === 400) {
              context.response.status = 400;
              context.response.body = {
                msg: validator.msg,
              };
              return;
            }
          }
          if (context.request.method === "PUT") {
            const validator = await loggervalidatorupdate(x);
            if (validator.status === 400) {
              context.response.status = 400;
              context.response.body = {
                msg: validator.msg,
              };
              return;
            }
          }
        }
      } else {
        context.response.status = 400;
        context.response.body = {
          msg: "API_TYPE header must be 'logger' or 'log'",
        };
        return;
      }
    }
    await next();
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      msg: error.message,
    };
  }
};

export default controllersApiValidationMiddleware;
