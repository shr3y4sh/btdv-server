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
