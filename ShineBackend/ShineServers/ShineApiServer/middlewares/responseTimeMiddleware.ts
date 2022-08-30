import {Context} from "../../Shared/deps.ts";

// Response Time
const responseTimeMiddleware = async (context:Context, next:Function) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
};

export default responseTimeMiddleware;
