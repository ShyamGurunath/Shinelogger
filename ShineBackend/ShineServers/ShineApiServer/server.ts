import {Application} from "../Shared/deps.ts";
import router from './routes.ts';
import {log} from "../Shared/deps.ts";
import {SHINESERVERPORT,SHINESERVERHOST} from "../Shared/constants.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

log.info(`ShineLogger Server Started on ${SHINESERVERHOST}:${SHINESERVERPORT}`);

app.listen({ port: SHINESERVERPORT });

