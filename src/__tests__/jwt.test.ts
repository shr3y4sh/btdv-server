import jwt, { JwtPayload } from "jsonwebtoken";
import { makeJWT, validateJWT } from "src/utils/jsonwebtoken";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const jwt_secret = "secret_token_key";

describe("makeJWT", () => {
	beforeEach(() => {
		// Mock Date.now to ensure consistent timestamps in tests
		vi.spyOn(Date, "now").mockReturnValue(1627846800000); // Fixed timestamp
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should create a valid JWT token", () => {
		const userId = "user123";
		const token = makeJWT(userId, jwt_secret);

		expect(token).toBeDefined();
		expect(typeof token).toBe("string");
		expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
	});

	it("should include correct payload structure", () => {
		const userId = "user456";
		const token = makeJWT(userId, jwt_secret);
		const decoded = jwt.decode(token) as JwtPayload;

		expect(decoded.sub).toBe(userId);
		expect(decoded.iss).toBe("chirpy");
		expect(decoded.iat).toBeDefined();
		expect(decoded.exp).toBeDefined();
		expect(typeof decoded.iat).toBe("number");
		expect(typeof decoded.exp).toBe("number");
	});

	it("should set expiration time correctly", () => {
		const userId = "user789";
		const token = makeJWT(userId, jwt_secret);
		const decoded = jwt.decode(token) as JwtPayload;

		expect(decoded.exp).toBeGreaterThan(decoded.iat!);
		expect(decoded.exp! - decoded.iat!).toBe(60 * 60 * 60);
	});

	it("should handle different user IDs", () => {
		const userIds = ["user1", "user2", "user3"];
		const tokens = userIds.map((id) => makeJWT(id, jwt_secret));

		tokens.forEach((token, index) => {
			const decoded = jwt.decode(token) as JwtPayload;
			expect(decoded.sub).toBe(userIds[index]);
		});
	});

	it("should create different tokens for same user at different times", () => {
		const userId = "sameUser";
		const token1 = makeJWT(userId, jwt_secret);

		// Advance time
		vi.spyOn(Date, "now").mockReturnValue(1627846860000); // 1 minute later
		const token2 = makeJWT(userId, jwt_secret);

		expect(token1).not.toBe(token2);
	});
});

describe("validateJwt", () => {
	const expiresIn = 15 * 60 * 1000;
	it("should validate a valid JWT token", () => {
		const userId = "validUser";
		const token = makeJWT(userId, jwt_secret);
		const result = validateJWT(token, jwt_secret);

		expect(result).not.toBeNull();
		expect(result).toBe(userId);
	});

	it("should throw error for invalid token format", () => {
		const invalidToken = "not.a.valid.jwt";

		expect(() => validateJWT(invalidToken, jwt_secret)).toThrow();
	});

	it("should throw error for empty token", () => {
		expect(() => validateJWT("", jwt_secret)).toThrow();
	});

	it("should throw error for expired token", () => {
		// Create an expired token by mocking jwt.sign
		const expiredPayload: JwtPayload = {
			iss: "chirpy",
			iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
			exp: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago (expired)
			sub: "testUser",
		};

		const expiredToken = jwt.sign(expiredPayload, jwt_secret);

		expect(() => validateJWT(expiredToken, jwt_secret)).toThrow();
	});

	it("should throw error for token with wrong secret", () => {
		const wrongSecretToken = jwt.sign(
			{ sub: "user123", iss: "chirpy" },
			"wrong-secret"
		);

		expect(() => validateJWT(wrongSecretToken, jwt_secret)).toThrow();
	});

	it("should validate token payload fields correctly", () => {
		const userId = "detailedUser";
		const token = makeJWT(userId, jwt_secret);
		const result = validateJWT(token, jwt_secret);

		expect(result).toBe(userId);
	});
});
