import { Router, Request, Response } from 'express';
import { Receipt } from '../../../models/receipt';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	let filter = {};

	if (req.query.day) {
		filter = { day: req.query.day };
	}

	const receipts = await Receipt.find(filter).sort({ createdAt: -1 });

	res.status(200).send(receipts);
});

export { router as allReceiptsRouter };
