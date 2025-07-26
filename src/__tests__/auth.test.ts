import { describe, it, expect } from "vitest";

import { hashPassword, comparePassword } from "src/utils/auth";

describe("hashPassword", () => {
	it("should hash a password successfully", async () => {
		const password = "testPassword123";
		const hashedPassword = await hashPassword(password);

		expect(hashedPassword).toBeDefined();
		expect(typeof hashedPassword).toBe("string");
		expect(hashedPassword).not.toBe(password);
		expect(hashedPassword.length).toBeGreaterThan(0);
	});

	it("should generate different hashes for the same password", async () => {
		const password = "samePassword";
		const hash1 = await hashPassword(password);
		const hash2 = await hashPassword(password);

		expect(hash1).not.toBe(hash2);
	});

	it("should handle empty strings", async () => {
		const emptyPassword = "";
		const hashedPassword = await hashPassword(emptyPassword);

		expect(hashedPassword).toBeDefined();
		expect(typeof hashedPassword).toBe("string");
	});

	it("should handle special characters in password", async () => {
		const specialPassword = "!@#$%^&*()_+-=[]{}|;:,.<>?";
		const hashedPassword = await hashPassword(specialPassword);

		expect(hashedPassword).toBeDefined();
		expect(typeof hashedPassword).toBe("string");
	});

	it("should handle very long passwords", async () => {
		const longPassword = "a".repeat(1000);
		const hashedPassword = await hashPassword(longPassword);

		expect(hashedPassword).toBeDefined();
		expect(typeof hashedPassword).toBe("string");
	});
});

describe("comparePassword", () => {
	it("should return true for matching password and hash", async () => {
		const password = "correctPassword";
		const hashedPassword = await hashPassword(password);
		const result = await comparePassword(password, hashedPassword);

		expect(result).toBe(true);
	});

	it("should return false for non-matching password and hash", async () => {
		const password = "correctPassword";
		const wrongPassword = "wrongPassword";
		const hashedPassword = await hashPassword(password);
		const result = await comparePassword(wrongPassword, hashedPassword);

		expect(result).toBe(false);
	});

	it("should return false for empty password against hash", async () => {
		const password = "correctPassword";
		const hashedPassword = await hashPassword(password);
		const result = await comparePassword("", hashedPassword);

		expect(result).toBe(false);
	});

	it("should return false for password against invalid hash", async () => {
		const password = "correctPassword";
		const invalidHash = "not-a-valid-hash";

		await expect(
			comparePassword(password, invalidHash)
		).resolves.toBeFalsy();
	});

	it("should handle case sensitivity correctly", async () => {
		const password = "CaseSensitive";
		const hashedPassword = await hashPassword(password);
		const result1 = await comparePassword("CaseSensitive", hashedPassword);
		const result2 = await comparePassword("casesensitive", hashedPassword);

		expect(result1).toBe(true);
		expect(result2).toBe(false);
	});
});
