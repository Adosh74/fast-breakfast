import { Router } from 'express';
import { getOrderRouter } from './get-order';
import { addOrderRouter } from './add-order';

const router = Router();

router.use(getOrderRouter);
router.use(addOrderRouter);

export { router as orderRouter };
