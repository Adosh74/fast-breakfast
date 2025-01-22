import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { serverEnv } from '../config';
import { User, UserDoc } from '../models/user';

interface UserPayload {
	id: string;
	email: string;
	name: string;
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserDoc;
		}
	}
}

export const currentUser = async (req: Request, _res: Response, next: NextFunction) => {
	if (!req.session?.jwt) {
		return next();
	}

	try {
		const payload = jwt.verify(req.session.jwt, serverEnv.jwtKey) as UserPayload;

		const currentUser = await User.findById(payload.id);

		if (!currentUser) {
			return next();
		}

		req.currentUser = currentUser;
	} catch (error) {
		return next();
	}

	next();
};
