import { Router, Request, Response } from 'express';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { Order } from '../../../models/order';

const router = Router();

router.get('/', currentUser, requireAuth, async (req: Request, res: Response) => {
	const day = new Date().toISOString().slice(0, 10);

	const orders = await Order.find({ day, received: false });

	res.status(200).send(orders);
});

export { router as getDayOrdersRouter };
