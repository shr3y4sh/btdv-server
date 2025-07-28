import { Request, Response } from "express";
import { upgradeUserRed } from "../../../db/queries/users.js";
import { ApiKeyNotFoundError, NotFoundError } from "../../../errors/error.js";
import { getAPIKey } from "../../../middlewares/apikey.js";
import { config } from "../../../config/config.js";

export async function handlerUpgradeUser(
	req: Request<any, any, reqBody>,
	res: Response
) {
	const { data, event } = req.body;

	if (event !== "user.upgraded") {
		res.sendStatus(204);
		return;
	}

	const apiKey = getAPIKey(req);

	if (apiKey !== config.polkaApiKey) {
		throw new ApiKeyNotFoundError("Invalid Api Key");
	}

	const result = await upgradeUserRed(data.userId);

	if (!result) {
		throw new NotFoundError("User not found");
	}

	res.sendStatus(204);
}

type reqBody = {
	event: "user.upgraded";
	data: {
		userId: string;
	};
};
