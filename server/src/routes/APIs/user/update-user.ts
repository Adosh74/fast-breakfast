import { Router, Request, Response } from 'express';
import { param } from 'express-validator';

import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { requirePrivilege } from '../../../middlewares/privilege';
import { User } from '../../../models/user';
import { NotFound } from '../../../errors/not-found-error';

const router = Router();

router.patch(
	'/:userId',
	currentUser,
	requireAuth,
	requirePrivilege('admin'),
	[param('userId').isString().withMessage('userId must be a string')],
	async (req: Request, res: Response) => {
		const { userId } = req.params;

		const user = await User.findByIdAndUpdate(userId, req.body, { new: true });

		if (!user) {
			throw new NotFound('User not found');
		}

		res.status(200).send(user);
	}
);

export { router as updateUserRouter };
