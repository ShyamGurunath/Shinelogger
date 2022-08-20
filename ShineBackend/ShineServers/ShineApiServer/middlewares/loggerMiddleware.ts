import { bold, cyan, green } from "../../Shared/deps.ts";

const loggerMiddleware = async (context, next) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  console.log(
    `${green(context.request.method)} ${cyan(context.request.url.pathname)} - ${
      bold(
        String(rt),
      )
    }`,
  );
};

export default loggerMiddleware;
