import express from "express";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { handlerChirpValidation } from "./api/chirp_validation.js";
import { middlewareLogResponses } from "./middlewares/log_responses.js";
import { config } from "./config/config.js";
import { handlerMetrics, handlerReset } from "./api/admin/controller.js";
import { handlerCreateUser } from "./api/users/controller.js";
import { errorHandler } from "./errors/error_handler.js";
import {
	middlewareMetricInc,
	handlerReadiness,
} from "./middlewares/readiness.js";

const app = express();
const PORT = 8080;

const migrationClient = postgres(config.db.dbUrl, { max: 1 });

await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.use(express.json());

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);

app.post("/api/validate_chirp", async (req, res, next) => {
	try {
		await handlerChirpValidation(req, res);
	} catch (err) {
		next(err);
	}
});

app.post("/api/users", async (req, res, next) => {
	try {
		await handlerCreateUser(req, res);
	} catch (err) {
		next(err);
	}
});

app.get("/admin/metrics", handlerMetrics);

app.post("/admin/reset", handlerReset);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
