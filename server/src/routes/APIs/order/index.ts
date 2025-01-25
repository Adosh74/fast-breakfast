import { Router } from 'express';
import { getOrderRouter } from './get-order';
import { addOrderRouter } from './add-order';
import { getMyOrdersRouter } from './my-orders';
import { getDayOrdersRouter } from './day-orders';

const router = Router();

router.use(getOrderRouter);
router.use(addOrderRouter);
router.use(getMyOrdersRouter);
router.use(getDayOrdersRouter);

export { router as orderRouter };
