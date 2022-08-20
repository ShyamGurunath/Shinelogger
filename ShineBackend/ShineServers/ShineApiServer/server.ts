import { Application, log } from "../Shared/deps.ts";
import router from "./routes.ts";
import { SHINESERVERHOST, SHINESERVERPORT } from "../Shared/constants.ts";
import loggerMiddleware from "./middlewares/loggerMiddleware.ts";
import responseTimeMiddleware from "./middlewares/responseTimeMiddleware.ts";
import onlyJsonContentTypeMiddleware from "./middlewares/onlyJsonContentTypeMiddleware.ts";
import controllersApiValidationMiddleware from "./middlewares/controllersApiValidationMiddleware.ts";

const app = new Application();

// Logger
app.use(loggerMiddleware);
// Response Time
app.use(responseTimeMiddleware);

//  accept only application/json content-type application/json
app.use(onlyJsonContentTypeMiddleware);

// contollers api validation middleware
app.use(controllersApiValidationMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());

log.info(`ShineLogger Server Started on ${SHINESERVERHOST}:${SHINESERVERPORT}`);

app.listen({ port: SHINESERVERPORT });
