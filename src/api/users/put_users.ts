import { Request, Response } from "express";
import { UserResponse } from "../../schema.js";
import { getBearerToken } from "../../middlewares/bearertoken.js";
import { validateJWT } from "../../utils/jsonwebtoken.js";
import { config } from "../../config/config.js";
import { InvalidTokenError } from "../../errors/error.js";
import { updateUserDetails } from "../../db/queries/users.js";
import { hashPassword } from "../../utils/auth.js";

export async function handlerUpdateUser(
	req: Request<any, any, UserResponse>,
	res: Response
) {
	const { email, password } = req.body;

	const token = getBearerToken(req);

	let userId;

	try {
		userId = validateJWT(token, config.jwtSecret);
	} catch (err) {
		console.error(err);
		throw new InvalidTokenError("Invalid/expired JWT token");
	}

	if (!userId) {
		throw new InvalidTokenError("userId invalid");
	}
	const hash = await hashPassword(password);

	const [user] = await updateUserDetails(userId, email, hash);

	const { hashedPassword, ...userDetails } = user;

	res.status(200).json(userDetails);
}
