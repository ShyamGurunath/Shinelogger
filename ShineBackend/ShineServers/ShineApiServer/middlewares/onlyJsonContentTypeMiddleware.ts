// add a middleware to accept only json data in content-type application/json
const onlyJsonContentTypeMiddleware = async (context, next) => {
  // check if request is POST or PUT
  if (context.request.method === "POST" || context.request.method === "PUT") {
    if (context.request.headers.get("Content-Type") !== "application/json") {
      context.response.status = 415;
      context.response.body = {
        msg: "Content-Type must be application/json",
      };
      return;
    }
  }
  await next();
};

export default onlyJsonContentTypeMiddleware;
