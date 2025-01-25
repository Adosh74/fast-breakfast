import { NextFunction, Request, Response } from 'express';
import { RequirePrivilegeError } from '../errors/require-privilege-error';

const requirePrivilege = (privilege: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.currentUser || req.currentUser!.role !== privilege) {
			throw new RequirePrivilegeError(
				`You don't have ${privilege} privilege to access`
			);
		}

		next();
	};
};

export { requirePrivilege };
