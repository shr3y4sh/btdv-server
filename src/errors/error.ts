export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
	}
}
export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class ForbiddenError extends Error {
	constructor(message: string) {
		super(message);
	}
}
export class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message);
	}
}
export class InvalidTokenError extends UnauthorizedError {
	constructor(message: string) {
		super(message);
	}
}

export class ApiKeyNotFoundError extends UnauthorizedError {
	constructor(message: string) {
		super(message);
	}
}
