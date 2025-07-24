import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { chirps } from "../../schema.js";

export async function createChirp(body: string, userId: string) {
	return await db.insert(chirps).values({ body, userId }).returning();
}

export async function getAllChirps() {
	return await db.select().from(chirps).orderBy(chirps.createdAt);
}

export async function findChirpById(chirpId: string) {
	return await db.query.chirps.findFirst({ where: eq(chirps.id, chirpId) });
}
