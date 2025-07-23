import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../schema.js";
import { config } from "./config.js";

const connection = postgres(config.db.dbUrl);

export const db = drizzle(connection, { schema });
