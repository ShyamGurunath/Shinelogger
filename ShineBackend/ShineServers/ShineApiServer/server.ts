import { Application } from "../Shared/deps.ts";
import  logging  from "../Shared/logsHandler.ts";
import router from "./routes.ts";
import { SHINESERVERHOST, SHINESERVERPORT } from "../Shared/constants.ts";
import loggerMiddleware from "./middlewares/loggerMiddleware.ts";
import responseTimeMiddleware from "./middlewares/responseTimeMiddleware.ts";
import onlyJsonContentTypeMiddleware from "./middlewares/onlyJsonContentTypeMiddleware.ts";
import controllersApiValidationMiddleware from "./middlewares/controllersApiValidationMiddleware.ts";
import { oakCors } from "../Shared/deps.ts";

const app = new Application();

// Logger
app.use(loggerMiddleware);
// Response Time
app.use(responseTimeMiddleware);

//  accept only application/json content-type application/json
app.use(onlyJsonContentTypeMiddleware);

// contollers api validation middleware
app.use(controllersApiValidationMiddleware);
app.use(oakCors({
    origin: "*",
}));
app.use(router.routes());
app.use(router.allowedMethods());

logging.info(`ShineLogger Server Started on ${SHINESERVERHOST}:${SHINESERVERPORT}`);

app.listen({ port: parseInt(SHINESERVERPORT) }).catch((err) => {
    logging.error(err);
})
