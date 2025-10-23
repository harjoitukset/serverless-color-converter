import { Hono } from "hono";
import { fromHono } from "chanfana";

export const apiRouter = fromHono(new Hono());
