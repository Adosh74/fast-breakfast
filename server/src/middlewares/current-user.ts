import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { serverEnv } from '../config';

interface UserPayload {
	id: string;
	email: string;
	name: string;
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

export const currentUser = (req: Request, _res: Response, next: NextFunction) => {
	if (!req.session?.jwt) {
		return next();
	}

	try {
		const payload = jwt.verify(req.session.jwt, serverEnv.jwtKey) as UserPayload;
		req.currentUser = payload;
	} catch (error) {
		return next();
	}

	next();
};
