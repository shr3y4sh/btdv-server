import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: "postgresql://shreyashs:postgres@localhost:5432/chirpy?sslmode=disable",
	},
	out: "./src/db/migrations",
});
