import { CustomError } from './custom-error';

export class RequirePrivilegeError extends CustomError {
	statusCode = 401;

	constructor(public message: string = 'Require Privilege') {
		super(message);

		Object.setPrototypeOf(this, RequirePrivilegeError.prototype);
	}

	serializeErrors() {
		return [
			{
				message: 'Require privilege to access this route',
			},
		];
	}
}
