import {bold, cyan, green} from "../../Shared/deps.ts";
import {Context} from "../../Shared/deps.ts";
import logging from "../../Shared/logsHandler.ts";


const loggerMiddleware = async (context:Context, next:Function) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  console.log(
    `${green(context.request.method)} ${cyan(context.request.url.pathname)} - ${
      bold(
        String(rt),
      )
    }`,
  );
    logging.info(
        `${green(context.request.method)} ${cyan(context.request.url.pathname)} - ${
            bold(
                String(rt),
            )
        }`,
    );
};

export default loggerMiddleware;
