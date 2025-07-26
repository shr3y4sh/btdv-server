import { Request, Response } from "express";
import { getUserByEmail } from "../../db/queries/users.js";
import { UnauthorizedError } from "../../errors/error.js";
import { UserResponse } from "../../schema.js";
import { comparePassword, makeRefreshToken } from "../../utils/auth.js";
import { makeJWT } from "../../utils/jsonwebtoken.js";
import { config } from "../../config/config.js";
import { createRefreshToken } from "../../db/queries/reftokens.js";

export async function handlerLogin(
	req: Request<unknown, unknown, UserResponse>,
	res: Response
) {
	let { email, password } = req.body;

	const [user] = await getUserByEmail(email);

	if (!user) {
		throw new UnauthorizedError("Invalid email");
	}

	const passCheck = await comparePassword(password, user.hashedPassword);

	if (!passCheck) {
		throw new UnauthorizedError("Invalid password");
	}

	const token = makeJWT(user.id, config.jwtSecret);

	const refreshToken = makeRefreshToken();

	const { id, createdAt, updatedAt } = user;

	await createRefreshToken(refreshToken, id);

	res.status(200).json({
		id,
		email,
		createdAt,
		updatedAt,
		token,
		refreshToken,
	});
}
