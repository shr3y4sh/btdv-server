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
