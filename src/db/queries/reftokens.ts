import { and, eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { refreshTokens } from "../../schema.js";

export async function createRefreshToken(token: string, userId: string) {
	const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

	return await db
		.insert(refreshTokens)
		.values({
			token,
			expiresAt,
			userId,
			revokedAt: null,
		})
		.returning();
}

export async function getRefreshToken(token: string) {
	return await db.query.refreshTokens.findFirst({
		where: eq(refreshTokens.token, token),
	});
}

export async function revokeRefreshToken(token: string) {
	await db
		.update(refreshTokens)
		.set({ revokedAt: new Date() })
		.where(eq(refreshTokens.token, token));
}
