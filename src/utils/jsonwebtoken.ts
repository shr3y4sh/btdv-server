import jwt, { JwtPayload } from "jsonwebtoken";

export type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userId: string, secret: string) {
	const issueAt = Math.floor(Date.now() / 1000);

	const payload: Payload = {
		iss: "chirpy",
		sub: userId,
		iat: issueAt,
		exp: issueAt + 60 * 60,
	};

	return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string) {
	const result = jwt.verify(tokenString, secret) as JwtPayload;

	return result.sub;
}
