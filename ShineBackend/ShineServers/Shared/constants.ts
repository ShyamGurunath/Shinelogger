export const MONGOHOST = Deno.env.get("MONGOHOST") ?? "localhost";
export const MONGOPORT = Deno.env.get("MONGOPORT") ?? "27017";
export const MONGOUSER = Deno.env.get("MONGOUSER") ?? "root";
export const MONGOPASSWORD = Deno.env.get("MONGOPASSWORD") ?? "root";
export const DATABASENAME = Deno.env.get("DATABASENAME") ?? "loggerController";
export const LOGGERCOLLECTION = Deno.env.get("LOGGERCOLLECTION") ??
  "Shineloggers";
export const SHINESERVERPORT = Deno.env.get("SHINESERVERPORT") ?? 8000;
export const SHINESERVERHOST = Deno.env.get("SHINESERVERHOST") ?? "localhost";
export const SHINEWEBSOCKETHOST = Deno.env.get("SHINEWEBSOCKETHOST") ??
  "localhost";
export const SHINEWEBSOCKETPORT = Deno.env.get("SHINEWEBSOCKETPORT") ?? 8001;
