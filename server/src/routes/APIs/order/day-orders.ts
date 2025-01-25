import { Router, Request, Response } from 'express';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { param } from 'express-validator';
import { validateRequest } from '../../../middlewares/validate-request';
import { requirePrivilege } from '../../../middlewares/privilege';
import { Order } from '../../../models/order';

const router = Router();

router.get(
	'/day/:day',
	currentUser,
	requireAuth,
	requirePrivilege('admin'),
	[param('day').isString().withMessage('Day must be a string')],
	validateRequest,
	async (req: Request, res: Response) => {
		const { day } = req.params;

		const orders = await Order.find({ day, received: false }).sort({ createdAt: -1 });

		res.status(200).send(orders);
	}
);

export { router as getDayOrdersRouter };
