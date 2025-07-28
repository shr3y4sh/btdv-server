import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { chirps } from "../../schema.js";

export async function createChirp(body: string, userId: string) {
	return await db.insert(chirps).values({ body, userId }).returning();
}

export async function getAllChirps() {
	return await db.select().from(chirps).orderBy(chirps.createdAt);
}

export async function getChirpsByAuthor(authorId: string) {
	return await db.select().from(chirps).where(eq(chirps.userId, authorId));
}

export async function findChirpById(chirpId: string) {
	return await db.query.chirps.findFirst({ where: eq(chirps.id, chirpId) });
}

export async function deleteChirp(chirpId: string) {
	await db.delete(chirps).where(eq(chirps.id, chirpId));
}
