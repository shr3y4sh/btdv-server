import { Request, Response } from "express";

import { createUser } from "../../db/queries/users.js";
import { NewUser, UserResponse } from "../../schema.js";
import { hashPassword } from "../../utils/auth.js";

export async function handlerCreateUser(
	req: Request<unknown, unknown, UserResponse>,
	res: Response
) {
	const hash = await hashPassword(req.body.password);

	const newUser: NewUser = {
		email: req.body.email,
		hashedPassword: hash,
	};

	const user = await createUser(newUser);

	const { email, id, createdAt, updatedAt } = user;

	res.status(201).json({ id, email, createdAt, updatedAt });
}
