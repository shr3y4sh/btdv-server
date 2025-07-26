import express from "express";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { middlewareLogResponses } from "./middlewares/log_responses.js";
import { config } from "./config/config.js";
import { handlerMetrics, handlerReset } from "./api/admin/metrics_reset.js";
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
import { handlerLogin } from "./api/login/post_login.js";
import { handlerRefresh } from "./api/refresh/post_refresh.js";
import { handlerRevoke } from "./api/revoke/post_revoke.js";

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

app.post("/api/login", async (req, res, next) => {
	try {
		await handlerLogin(req, res);
	} catch (error) {
		next(error);
	}
});
app.post("/api/refresh", async (req, res, next) => {
	try {
		await handlerRefresh(req, res);
	} catch (error) {
		next(error);
	}
});
app.post("/api/revoke", async (req, res, next) => {
	try {
		await handlerRevoke(req, res);
	} catch (error) {
		next(error);
	}
});

app.get("/admin/metrics", handlerMetrics);

app.post("/admin/reset", handlerReset);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
