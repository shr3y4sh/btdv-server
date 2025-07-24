import express from "express";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { middlewareLogResponses } from "./middlewares/log_responses.js";
import { config } from "./config/config.js";
import { handlerMetrics, handlerReset } from "./api/admin/controller.js";
import { handlerCreateUser } from "./api/users/post_users.js";
import { errorHandler } from "./errors/error_handler.js";
import {
	middlewareMetricInc,
	handlerReadiness,
} from "./middlewares/readiness.js";
import { handlerCreateChirp } from "./api/chirps/post_chirps.js";
import {
	handlerGetChirpById,
	handlerGetChirps,
} from "./api/chirps/get_chirps.js";

const app = express();
const PORT = 8080;

const migrationClient = postgres(config.db.dbUrl, { max: 1 });

await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.use(express.json());

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);

app.post("/api/chirps", async (req, res, next) => {
	try {
		await handlerCreateChirp(req, res);
	} catch (err) {
		next(err);
	}
});
app.get("/api/chirps", async (req, res, next) => {
	try {
		await handlerGetChirps(req, res);
	} catch (err) {
		next(err);
	}
});
app.get("/api/chirps/:id", async (req, res, next) => {
	try {
		await handlerGetChirpById(req, res);
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
