import { Router, Request, Response } from 'express';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { Order } from '../../../models/order';

const router = Router();

router.get('/', currentUser, requireAuth, async (req: Request, res: Response) => {
	const orders = await Order.find({
		userId: req.currentUser!.id,
	}).sort({ createdAt: -1 });

	res.status(200).send(orders);
});

export { router as getMyOrdersRouter };
