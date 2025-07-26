import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";

export async function hashPassword(password: string) {
	const salt = 10;

	return await bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}

export function makeRefreshToken() {
	return randomBytes(256).toString("hex");
}
