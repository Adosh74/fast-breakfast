import { Router, Request, Response } from 'express';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { requirePrivilege } from '../../../middlewares/privilege';
import { User } from '../../../models/user';

const router = Router();

router.get(
	'/',
	currentUser,
	requireAuth,
	requirePrivilege('admin'),
	async (req: Request, res: Response) => {
		const users = await User.find({ _id: { $ne: req.currentUser!._id } }).sort({
			createdAt: -1,
		});

		res.status(200).send(users);
	}
);

export { router as allUsersRouter };
