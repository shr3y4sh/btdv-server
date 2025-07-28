import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { NewUser, users } from "../../schema.js";

export async function createUser(user: NewUser) {
	const [res] = await db
		.insert(users)
		.values(user)
		.onConflictDoNothing()
		.returning();

	return res;
}

export async function deleteAllUsers() {
	await db.delete(users);
}

export async function getUserByEmail(email: string) {
	return await db.select().from(users).where(eq(users.email, email));
}

export async function updateUserDetails(
	userId: string,
	email: string,
	hashedPassword: string
) {
	return await db
		.update(users)
		.set({ email, hashedPassword })
		.where(eq(users.id, userId))
		.returning();
}

export async function upgradeUserRed(userId: string) {
	const result = await db
		.update(users)
		.set({ isChirpyRed: true })
		.where(eq(users.id, userId))
		.returning();

	// console.log(result.length);

	return result.length > 0;
}
