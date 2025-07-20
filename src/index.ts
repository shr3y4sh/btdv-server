import express from "express";
import { handlerReadiness } from "./readiness.js";
import { middlewareLogResponses } from "./log_responses.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);

app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
