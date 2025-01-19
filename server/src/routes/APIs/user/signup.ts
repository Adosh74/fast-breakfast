import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../../../models/user';
import { validateRequest } from '../../../middlewares/validate-request';
import { BadRequestError } from '../../../errors/bad-request-error';
import { serverEnv } from '../../../config';

const router = Router();

router.post(
	'/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('name')
			.trim()
			.notEmpty()
			.isLength({
				min: 4,
				max: 20,
			})
			.withMessage('You must supply a name'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password, name } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError('Email in use');
		}

		const user = User.build({ email, password, name });

		await user.save();
		user.password = '';

		const userJwt = jwt.sign(
			{
				id: user._id,
				email: user.email,
				name: user.name,
			},
			serverEnv.jwtKey
		);

		req.session = {
			jwt: userJwt,
		};

		res.status(201).send(user);
	}
);

export { router as signupRouter };
