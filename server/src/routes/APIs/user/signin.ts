import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../../middlewares/validate-request';
import { Password } from '../../../services/password';
import { User } from '../../../models/user';
import { BadRequestError } from '../../../errors/bad-request-error';

const router = Router();

router.post(
	'/signin',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password').trim().notEmpty().withMessage('You must supply a password'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (!existingUser) throw new BadRequestError('Invalid credentials');

		const passwordMatch = await Password.compare(existingUser.password, password);

		if (!passwordMatch) throw new BadRequestError('Invalid credentials');

		const userJwt = jwt.sign(
			{
				id: existingUser._id,
				email: existingUser.email,
				name: existingUser.name,
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: userJwt,
		};

		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
