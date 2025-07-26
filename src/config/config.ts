import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type ApiConfig = {
	fileServerHits: number;
	db: DBConfig;
	platform: string;
	jwtSecret: string;
};

type DBConfig = {
	dbUrl: string;
	migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
	migrationsFolder: "./src/db/migrations",
};

const dbConfig: DBConfig = {
	dbUrl: envOrThrow(process.env.DB_URL),
	migrationConfig,
};

export const config: ApiConfig = {
	fileServerHits: 0,
	db: dbConfig,
	platform: envOrThrow(process.env.PLATFORM),
	jwtSecret: envOrThrow(process.env.JWT_SECRET),
};

export function envOrThrow(text: unknown): string {
	if (typeof text === "string") {
		return text;
	}

	throw new Error("env string not loaded");
}
