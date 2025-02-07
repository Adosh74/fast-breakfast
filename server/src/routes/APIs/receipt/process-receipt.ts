import { Router, Request, Response } from 'express';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { Order } from '../../../models/order';
import { Receipt } from '../../../models/receipt';
import { body } from 'express-validator';
import { validateRequest } from '../../../middlewares/validate-request';
import { NotFound } from '../../../errors/not-found-error';
import moment from 'moment';

import { startSession } from 'mongoose';

const router = Router();

router.post(
	'/',
	currentUser,
	requireAuth,
	[body('name').isString().withMessage('Name must be a string')],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name } = req.body;

		const day = moment().format('YYYY-MM-DD');

		const orders = await Order.find({ day, received: false }, { _id: 1 });

		if (orders.length === 0) {
			throw new NotFound('No orders found for today');
		}

		const ordersId = orders.map((order) => order.id);

		const receipt = Receipt.build({ name, ordersId });

		await Order.updateMany({ _id: { $in: ordersId } }, { received: true });

		await receipt.save();

		// const session = await startSession();
		// session.startTransaction();
		// try {
		// 	await Order.updateMany(
		// 		{ _id: { $in: ordersId } },
		// 		{ received: true }
		// 	).session(session);

		// 	await receipt.save({ session });
		// 	await session.commitTransaction();
		// } catch (error) {
		// 	await session.abortTransaction();
		// 	throw error;
		// } finally {
		// 	session.endSession();
		// }

		res.status(201).send(receipt);
	}
);

export { router as processReceiptRouter };
