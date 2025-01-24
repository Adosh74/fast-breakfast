import { Router } from 'express';
import { getOrderRouter } from './get-order';
import { addOrderRouter } from './add-order';
import { getDayOrdersRouter } from './get-day-orders';

const router = Router();

router.use(getOrderRouter);
router.use(addOrderRouter);
router.use(getDayOrdersRouter);

export { router as orderRouter };
