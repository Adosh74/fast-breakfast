import { Router } from 'express';
import { userRoutes } from './APIs/user';
import { healthCheckRouter } from './APIs/health-check';
import { itemRoutes } from './APIs/item';
import { orderRouter } from './APIs/order';
import { receiptRouter } from './APIs/receipt';
import { statisticsRouter } from './APIs/statistics';

const routes = Router();

routes.use(healthCheckRouter);

routes.use('/users', userRoutes);
routes.use('/items', itemRoutes);
routes.use('/orders', orderRouter);
routes.use('/receipts', receiptRouter);
routes.use('/statistics', statisticsRouter);

export { routes };
